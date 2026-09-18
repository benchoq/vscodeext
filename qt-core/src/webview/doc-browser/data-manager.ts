// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { fsDir } from '@/fs-utils';
import { QchReader } from './qch-reader';
import { HtmlFullTextIndex } from './text-search';

const qchDir = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

export class DocBrowserDataManager {
  private readonly _readersPromise: Promise<QchReader[]>;
  private readonly _fullTextIndex = new HtmlFullTextIndex();
  private readonly _fullTextIndexBuild: Promise<void>;

  constructor() {
    const qchFiles = fsDir(qchDir).findFiles("*.qch");

    this._readersPromise = Promise.all(
      qchFiles.map(async (filePath) => QchReader.create(filePath)),
    );

    this._fullTextIndexBuild = this._fullTextIndex.build(qchDir);
  }

  public async readToc() {
    const readers = await this._readersPromise;
    const results = await Promise.all(
      readers.map((r) => r.readToc())
    );

    return results.flat();
  }

  public async readIndexes() {
    const readers = await this._readersPromise;
    const results = await Promise.all(
      readers.map((r) => r.readIndexes())
    );

    return results.flat();
  }

  public async searchIndex(keyword: string) {
    const readers = await this._readersPromise;
    const results = await Promise.all(
      readers.map((r) => r.searchIndex(keyword))
    );

    return results.flat().sort((a, b) => {
      const aExact = a.name === keyword ? 0 : 1;
      const bExact = b.name === keyword ? 0 : 1;
      return aExact - bExact;
    });
  }

  public async searchFullText(keyword: string) {
    await this._fullTextIndexBuild;
    const results = this._fullTextIndex.search(keyword);
    return results;
  }
}
