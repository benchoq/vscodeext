// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import fg from 'fast-glob';
import MiniSearch, { SearchResult } from 'minisearch';

import { FullTextMatch } from '@/webview/shared/qt-help';

const NumBatch = 25;
const NumConcurrency = 4;

const TitleTier = {
  Word: 0,
  WordPartial: 1,
  Prefix: 2,
  Fuzzy: 3,
} as const;

// Characters that separate plain words: whitespace and punctuation.
// Example: "Object Model | Qt Core" -> ["Object", "Model", "Qt", "Core"]
const WordSeparators = /[\s\-.,:;|/()<>*&[\]{}"'=+!?]+/;

// Splits camelCase / PascalCase identifiers at word boundaries:
//   (?<=[a-z0-9])(?=[A-Z])      lower/digit -> upper   "objectName"  -> "object" | "Name"
//   (?<=[A-Z])(?=[A-Z][a-z])    acronym -> new word    "QJniObject" -> "Q" | "Jni" | "Object"
const CamelCaseBoundary = /(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;

// Tokenizer for MiniSearch: splits text into words, and additionally into
// identifier parts so that a search for "object" can match "ObjectModel".
// The original word is kept so that exact searches (e.g. "ObjectModel") still work.
// One-letter parts are dropped, so "QObject" stays ["QObject"] (no "Q", no "Object").

// Examples:
//   "ObjectModel QML Type" -> ["ObjectModel", "Object", "Model", "QML", "Type"]
//   "QObject Class"        -> ["QObject", "Class"]
//   "Qt::AlignLeft"        -> ["Qt", "AlignLeft", "Align", "Left"]
const splitIdentifier = (s: string): string[] => s
  .split(WordSeparators)
  .flatMap((word) => {
    const parts = word
      .split(CamelCaseBoundary)
      .filter((p) => p.length > 1);
    return parts.length > 1 ? [word, ...parts] : [word];
  })
  .filter(Boolean);

// Splits text into plain words only (no camelCase splitting).
// Used to tell a standalone word apart from an identifier part.

// Examples:
//   "Object Model | Qt Core" -> ["Object", "Model", "Qt", "Core"]
//   "ObjectModel QML Type"   -> ["ObjectModel", "QML", "Type"]
const splitWords = (s: string): string[] => s
  .split(WordSeparators)
  .filter(Boolean);

interface HtmlDoc {
  id: string;
  title: string;
  text: string;
  rootDir: string;
  snippet: string;
}

export class HtmlFullTextIndex {
  private readonly _textById = new Map<string, string>();
  private readonly _miniSearch = new MiniSearch<HtmlDoc>({
    fields: ['title', 'text'],
    storeFields: ['title', 'id', 'rootDir', 'snippet'],
    tokenize: splitIdentifier,
    searchOptions: {
      prefix: (term) => term.length >= 2,
      fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
    },
  });

  private _generation = 0;

  public async build(rootDir: string): Promise<void> {
    const gen = ++this._generation;
    this._miniSearch.removeAll();
    this._textById.clear();

    const files = await fg('**/*.html', { cwd: rootDir, absolute: true });
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(NumConcurrency);

    for (let i = 0; i < files.length; i += NumBatch) {
      if (gen !== this._generation) {
        return;
      }

      const docs: HtmlDoc[] = await Promise.all(
        files.slice(i, i + NumBatch).map(async (file) =>
          limit(async () => {
            const raw = await fs.readFile(file, 'utf-8');
            const $ = cheerio.load(raw);
            const title = $('title').text() || path.basename(file);
            const text = $('body').text().replace(/\s+/g, ' ').trim();
            return { id: file, title, text, rootDir, snippet: '' };
          })
        )
      );

      if (gen !== this._generation) {
        return;
      }

      this._miniSearch.addAll(docs);
      for (const doc of docs) {
        this._textById.set(doc.id, doc.text);
      }

      await new Promise((r) => setImmediate(r));
    }

    if (gen === this._generation) {
      this._warmUp();
    }
  }

  public search(query: string): FullTextMatch[] {
    const bodyHits = this._searchBodies(query);
    const titleHits = this._searchTitles(query);

    const result: FullTextMatch[] = [];
    const seenIds = new Set<string>();
    const addToResult = (candidates: SearchResult[]) => {
      for (const c of candidates) {
        const id = String(c.id);
        const title = String(c.title);

        if (!seenIds.has(id) && !shouldExclude(title)) {
          const filePathRel = path.relative(String(c.rootDir), id);
          const snippet = buildSnippet(this._textById.get(id) ?? '', c.terms);

          seenIds.add(id);
          result.push({
            type: 'full-text',
            page: { title, filePathRel },
            snippet
          });
        }
      }
    }

    addToResult(titleHits.strong);
    addToResult(bodyHits);
    addToResult(titleHits.weak);

    return result;
  }

  private _searchTitles(query: string) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const all = this._miniSearch
      .search(query, { fields: ['title'] })
      .map((r) => ({ r, tier: assessTitleTier(String(r.title), terms) }))
      .sort((a, b) => a.tier - b.tier); // score order is kept within a tier

    return {
      strong: all.filter((x) => x.tier < TitleTier.Fuzzy).map((x) => x.r),
      weak: all.filter((x) => x.tier >= TitleTier.Fuzzy).map((x) => x.r)
    }
  }

  private _searchBodies(query: string) {
    return this._miniSearch
      .search(query, { fields: ['text'] });
  }

  private _warmUp() {
    this.search('object');
  }
}

// helpers
function assessTitleTier(title: string, terms: string[]): number {
  const words = splitWords(title).map((w) => w.toLowerCase());
  const tokens = splitIdentifier(title).map((t) => t.toLowerCase());

  if (terms.every((t) => words.includes(t))) {
    return TitleTier.Word;
  } else if (terms.every((t) => tokens.includes(t))) {
    return TitleTier.WordPartial;
  } else if (terms.every((t) => tokens.some((tok) => tok.startsWith(t)))) {
    return TitleTier.Prefix;
  } else {
    return TitleTier.Fuzzy;
  }
}

function shouldExclude(title: string): boolean {
  const PrefixesToExclude = [
    'obsolete members',
    'list of all members'
  ];

  const t = title.toLowerCase();
  return PrefixesToExclude.some((prefix) => t.startsWith(prefix));
}

function buildSnippet(text: string, terms: string[], contextChars = 60) {
  let matchIndex = -1;
  const lower = text.toLowerCase();

  for (const term of terms) {
    const i = lower.indexOf(term.toLowerCase());
    if (i !== -1) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex === -1) {
    return text.slice(0, contextChars * 2);
  }

  const s = Math.max(0, matchIndex - contextChars);
  const e = Math.min(text.length, matchIndex + contextChars);

  const ellipsis = '…';
  return [
    s > 0 ? ellipsis : '',
    text.slice(s, e),
    e < text.length ? ellipsis : ''
  ].join('');
}
