// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import initSqlJs, { Database, SqlJsStatic, SqlValue } from 'sql.js';

import { createWrappedLogger } from 'qt-lib';

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

    return execToRecords(this._db, sql, params);
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

function execToRecords(db: Database, sql: string, params: SqlValue[] = []) {
  const s = db.prepare(sql);
  s.bind(params);

  const records = [];
  while (s.step()) {
    records.push(s.getAsObject());
  }

  s.free();
  return records;
}
