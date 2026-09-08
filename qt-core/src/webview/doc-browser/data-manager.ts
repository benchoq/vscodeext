// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QchReader } from './qch-reader';
import { fsDir } from '@/fs-utils';

const qchDir = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

export class DocBrowserDataManager {
  private readonly _readersPromise: Promise<QchReader[]>;

  constructor() {
    const qchFiles = fsDir(qchDir).findFiles("*.qch");

    this._readersPromise = Promise.all(
      qchFiles.map(async (filePath) => QchReader.create(filePath))
    );
  }

  public async searchIndex(keyword: string) {
    const readers = await this._readersPromise;

    const results = await Promise.all(
      readers.map((reader) =>
        reader.searchIndex(
          Sqls.searchIndex,
          [`%${keyword}%`, keyword]
        )
      )
    );

    return results.flat().sort((a, b) => {
      const aExact = a.name === keyword ? 0 : 1;
      const bExact = b.name === keyword ? 0 : 1;
      return aExact - bExact;
    });
  }
}

const Sqls = {
  searchIndex: `
    SELECT
      IndexTable.Name,
      IndexTable.FileId,
      IndexTable.Identifier,
      IndexTable.Anchor,
      FolderTable.Name as FolderName,
      FileNameTable.Name as FileName,
      FileNameTable.Title as FileTitle,
      NamespaceTable.Name as NamespaceName
    FROM
      IndexTable,
      FolderTable,
      FileNameTable,
      NamespaceTable
    WHERE
      IndexTable.Name LIKE ?
      AND IndexTable.FileId == FileNameTable.FileId
      AND FileNameTable.FolderId == FolderTable.Id
      AND FolderTable.NamespaceID == NamespaceTable.Id
    ORDER BY
      CASE WHEN IndexTable.Name = ? THEN 0 ELSE 1 END
  `
};
