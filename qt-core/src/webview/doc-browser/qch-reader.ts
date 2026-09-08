// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import initSqlJs, { Database, SqlJsStatic, SqlValue } from 'sql.js';

import { createWrappedLogger } from 'qt-lib';
import { IndexData } from '@/webview/shared/doc-browser';

let sqlPromise: Promise<SqlJsStatic> | undefined;
const logger = createWrappedLogger('qch-reader');

export class QchReader {
  private _db: Database | undefined;

  private constructor(private readonly _sql: SqlJsStatic) {}

  public static async create(qchPath: string) {
    const sql = await initSql();
    const reader = new QchReader(sql);

    reader._load(qchPath);
    return reader;
  }

  public _load(filePath: string) {
    const data = fs.readFileSync(filePath);
    this._db = new this._sql.Database(data);
  }

  public execToRecords(sql: string, params: SqlValue[] = []) {
    if (!this._db) {
      logger.text('Cannot exec sql, DB is not initialized')
        .data(sql)
        .error();

      return [];
    }

    return execToIndexData(this._db, sql, params);
  }
}

// helpers
async function initSql() {
  if (!sqlPromise) {
    const distPath = path.join(
      '/Users/bencho/ws_vscode/0907.doc-browser/vscodeext',
      'qt-core/node_modules/sql.js/dist'
    );

    sqlPromise = initSqlJs({
      locateFile: file => {
        return path.join(distPath, file);
      }
    });
  }

  return sqlPromise;
}

function execToIndexData(db: Database, sql: string, params: SqlValue[] = []) {
  const records: IndexData[] = [];
  const s = db.prepare(sql);
  s.bind(params);

  while (s.step()) {
    const o = s.getAsObject();
    const data: IndexData = {
      name: String(o.Name ?? ''),
      fileId: Number(o.FileId ?? 0),
      anchor: String(o.Identifier ?? ''),
      identifier: String(o.Identifier ?? '')
    }

    records.push(data);
  }

  s.free();
  return records;
}

