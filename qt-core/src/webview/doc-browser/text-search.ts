// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import fg from 'fast-glob';
import * as path from 'path';
import * as cheerio from 'cheerio';
import MiniSearch, { SearchResult } from 'minisearch';
import * as fs from 'fs/promises';
import { FullTextMatch } from '../shared/doc-browser';

interface HtmlDoc {
  id: string;
  title: string;
  text: string;
  rootDir: string;
  snippet: string;
}

export class HtmlFullTextIndex {
  private readonly textById = new Map<string, string>();

  private readonly miniSearch = new MiniSearch<HtmlDoc>({
    fields: ['title', 'text'],
    storeFields: ['title', 'id', 'rootDir', 'snippet'],
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
  });

  public async build(rootDir: string): Promise<void> {
    const files = await fg('**/*.html', { cwd: rootDir, absolute: true });

    const docs: HtmlDoc[] = await Promise.all(
      files.map(async (file) => {
        const raw = await fs.readFile(file, 'utf-8');
        const $ = cheerio.load(raw);
        const title = $('title').text() || path.basename(file);
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        return { id: file, title, text, rootDir, snippet: ''};
      })
    );

    this.miniSearch.addAll(docs);
    for (const doc of docs) {
      this.textById.set(doc.id, doc.text);
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  private buildSnippet(text: string, terms: string[], contextChars = 60): string {
    const lower = text.toLowerCase();
    let matchIndex = -1;
    for (const term of terms) {
      const idx = lower.indexOf(term.toLowerCase());
      if (idx !== -1) {
        matchIndex = idx;
        break;
      }
    }
    if (matchIndex === -1) {
      return text.slice(0, contextChars * 2);
    }

    const start = Math.max(0, matchIndex - contextChars);
    const end = Math.min(text.length, matchIndex + contextChars);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';
    return prefix + text.slice(start, end) + suffix;
  }

  public search(query: string): FullTextMatch[] {
    return this.miniSearch.search(query).map((r: SearchResult) => {
      const relPath = path.relative(String(r.rootDir), String(r.id));
      const fullText = this.textById.get(String(r.id)) ?? '';
      return {
        type: 'full-text',
        page: {
          title: String(r.title),
          filePathRel: relPath
        },
        snippet: this.buildSnippet(fullText, r.terms),
      };
    });
  }
}

