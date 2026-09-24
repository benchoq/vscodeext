// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import initSqlJs, { SqlJsStatic } from 'sql.js';

let sqlPromise: Promise<SqlJsStatic> | undefined;

export async function fetchSql() {
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

