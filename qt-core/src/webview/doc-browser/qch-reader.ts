// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import { Database, SqlJsStatic, SqlValue } from 'sql.js';

// import { createWrappedLogger } from 'qt-lib';
import { IndexData } from '@/webview/shared/doc-browser';
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

  public searchIndex(sql: string, params: SqlValue[] = []) {
    return searchIndex(this._filePath, this._db, sql, params);
  }
}

// helpers
function searchIndex(qchFilePath: string, db: Database, sql: string, params: SqlValue[] = []) {
  const records: IndexData[] = [];
  const s = db.prepare(sql);
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
      qchFilePath,
      qchFileName: path.basename(qchFilePath)
    }

    records.push(data);
  }

  s.free();
  return records;
}

