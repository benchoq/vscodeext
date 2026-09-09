// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import { Database, SqlJsStatic, SqlValue } from 'sql.js';

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

  public readToc(sql: string) {
    const entries: TocEntry[] = [];
    const s = this._db.prepare(sql);

    while (s.step()) {
      const o = s.getAsObject();
      const bytes = o.Data as Uint8Array;
      entries.push(...parseContentsTable(bytes));
    }

    s.free();
    return entries;
  }

  public searchIndex(sql: string, params: SqlValue[] = []) {
    const records: IndexData[] = [];
    const s = this._db.prepare(sql);
    s.bind(params);

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
}


// helpers
function parseContentsTable(data: Uint8Array): TocEntry[] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const entries: TocEntry[] = [];
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
