// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import fg from 'fast-glob';
import * as path from 'path';
import * as cheerio from 'cheerio';
import MiniSearch, { SearchResult } from 'minisearch';
import * as fs from 'fs/promises';
import { FullTextSearchData } from '../shared/doc-browser';

interface HtmlDoc {
  id: string;
  title: string;
  text: string;
  rootDir: string;
}

export class HtmlFullTextIndex {
  private readonly miniSearch = new MiniSearch<HtmlDoc>({
    fields: ['title', 'text'],
    storeFields: ['title', 'id', 'rootDir'],
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
        return {
          id: file,
          title,
          text,
          rootDir
        };
      })
    );

    this.miniSearch.addAll(docs);
  }

  public search(query: string): FullTextSearchData[] {
    return this.miniSearch.search(query).map((r: SearchResult) => {
      const relPath = path.relative(String(r.rootDir), String(r.id));
      return {
        filePath: String(r.id),
        fileName: path.basename(relPath),
        folderName: path.dirname(relPath),
        title: String(r.title),
      }
    });
  }
}
