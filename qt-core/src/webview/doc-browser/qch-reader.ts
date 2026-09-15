// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import { Database, SqlJsStatic } from 'sql.js';

// import { createWrappedLogger } from 'qt-lib';
import { IndexData, TocEntry } from '@/webview/shared/doc-browser';
import { fetchSql } from './sql';

// const logger = createWrappedLogger('qch-reader');

export class QchReader {
  private readonly _db: Database;

  private constructor(
    private readonly _sql: SqlJsStatic,
    private readonly _filePath: string
  ) {
    const data = fs.readFileSync(this._filePath);
    this._db = new this._sql.Database(data);
  }

  public static async create(qchPath: string) {
    return new QchReader(await fetchSql(), qchPath);
  }

  public readToc() {
    const entries: TocEntry[] = [];
    const s = this._db.prepare(Sqls.readContentData);

    while (s.step()) {
      const o = s.getAsObject();
      const bytes = o.Data as Uint8Array;
      entries.push(...
        parseContentsTable(bytes)
          .map(p => ({
              ...p,
              folderName: String(o.FolderName ?? '')
            } as TocEntry)
          )
      );
    }

    s.free();
    return entries;
  }

  public searchIndex(keyword: string) {
    const records: IndexData[] = [];
    const s = this._db.prepare(Sqls.searchIndex);
    s.bind([`%${keyword}%`, keyword]);

    while (s.step()) {
      const o = s.getAsObject();
      const data: IndexData = {
        name: String(o.Name ?? ''),
        fileId: Number(o.FileId ?? 0),
        anchor: String(o.Anchor ?? ''),
        identifier: String(o.Identifier ?? ''),
        folderName: String(o.FolderName ?? ''),
        fileName: String(o.FileName ?? ''),
        fileTitle: String(o.FileTitle ?? ''),
        namespaceName: String(o.NamespaceName ?? ''),
        qchFilePath: this._filePath,
        qchFileName: path.basename(this._filePath)
      }

      records.push(data);
    }

    s.free();
    return records;
  }

  public searchFullText(keyword: string) {
    console.log(this, keyword);
    return [];
  }
}

// helpers
function parseContentsTable(data: Uint8Array): Partial<TocEntry>[] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const entries: Partial<TocEntry>[] = [];
  let pos = 0;

  function readUint32(): number {
    const i = view.getUint32(pos, false);
    pos += 4;
    return i;
  }

  function readUtf16BE(length: number): string {
    const chars: string[] = [];
    for (let i = 0; i < length; i += 2) {
      chars.push(String.fromCharCode(view.getUint16(pos + i, false)));
    }
    pos += length;
    return chars.join('');
  }

  while (pos < data.length) {
    const depth = readUint32();
    const href = readUtf16BE(readUint32());
    const title = readUtf16BE(readUint32());

    entries.push({ depth, href, title });
  }

  return entries;
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
  `,

  readContentData: `
    SELECT
      ContentsTable.Data,
      FolderTable.Name as FolderName
    FROM
      ContentsTable,
      FolderTable
    WHERE
      ContentsTable.NamespaceID == FolderTable.NamespaceID
  `
};
