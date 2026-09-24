// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { fsDir } from '@/fs-utils';
import { QchReader } from './qch-reader';
import { HtmlFullTextIndex } from './text-search';
import { findDocRoots } from './qt-discovery';
import { coreAPI } from '@/extension';
import {
  getCurrentGlobalAdditionalQtPaths,
  getCurrentGlobalQtInstallationRoot
} from '@/installation-root';
import { QtDocRootInfo } from '@/webview/shared/doc-browser';

// const qchDir = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

export class DocBrowserDataManager {
  private _readersPromise: Promise<QchReader[]> = Promise.resolve([]);
  private readonly _fullTextIndex = new HtmlFullTextIndex();
  private _fullTextIndexBuild: Promise<void> = Promise.resolve();
  private _selectedPackage: QtDocRootInfo | undefined;

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public getPackages() {
    if (!coreAPI) {
      return [];
    }

    return findDocRoots({
      purpose: 'doc-browser',
      coreApi: coreAPI,
      insRoot: getCurrentGlobalQtInstallationRoot(),
      additionalQtpathsList: getCurrentGlobalAdditionalQtPaths()
    });
  }

  public selectPackage(p: QtDocRootInfo) {
    if (_.isEqual(this._selectedPackage, p)) {
      return;
    }

    this._selectedPackage = p;
    this._rebuild(p.fsPath);
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

  public async searchFullText(keyword: string) {
    await this._fullTextIndexBuild;
    const results = this._fullTextIndex.search(keyword);
    return Promise.resolve(results);
  }

  private _rebuild(docRootDir: string) {
    console.log('rebuild', this._selectedPackage);

    const qchFiles = fsDir(docRootDir).findFiles("*.qch");
    this._readersPromise = Promise.all(
      qchFiles.map(async (filePath) => QchReader.create(filePath)),
    );

    this._fullTextIndexBuild = this._fullTextIndex.build(docRootDir);
  }
}
