// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import {
  Disposable,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';
import initSqlJs from 'sql.js';

import { createLogger } from 'qt-lib';
import { WebviewChannel } from '@/webview/channel';
import {
  Command,
  CommandId,
  CommandHandler,
  IsCommand
} from '@/webview/shared/message';
// import {} from '@/webview/shared/doc-browser';
// import * as texts from '@/texts';

const logger = createLogger('doc-browser-dispatcher');

export class DocBrowserDispatcher {
  private readonly _comm: WebviewChannel;
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  // private readonly _viewConfig: ExBrowserViewConfig;
  private readonly _disposables: Disposable[] = [];

  public constructor(
    private readonly _context: Context,
    panel: Panel,
  ) {
    void this._context;

    this._comm = new WebviewChannel(panel.webview);
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.DocBrowserSearch, this._onSearch],
    ]);

    // this._viewConfig = helpers.createViewConfig(this._context);

    this._disposables = [
      this._comm,
      this._comm.onDidReceiveMessage((m) => {
        void this.dispatch(m);
      })
    ];
  }

  public dispose() {
    this._disposables.forEach((d) => void d.dispose());
    this._disposables.length = 0;
  }

  public async dispatch(cmd: unknown) {
    if (!IsCommand(cmd)) {
      return;
    }

    const handler = this._handlers?.get(cmd.id);
    if (!handler) {
      logger.warn(`unhandled command: id = ${CommandId[cmd.id]}`);
      return;
    }

    try {
      await handler(cmd);
    } catch (e) {
      logger.error(`Cannot handle command '${String(cmd.id)}': ${String(e)}`);
    }
  }

  // handlers
  private readonly _onSearch = async (cmd: Command) => {
    const keyword = String(_.get(cmd.payload, 'keyword', '')).trim();
    const SQL = await initSqlJs({
      locateFile: file => {
        return path.join(
          '/Users/bencho/ws_vscode/0907.doc-browser/vscodeext',
          'qt-core/node_modules/sql.js/dist',
          file
        );
      }
    });

    const qch = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1/qtcore.qch';
    const data = fs.readFileSync(qch);
    const db = new SQL.Database(data);
    const result = db.exec(`
      SELECT *
      FROM IndexTable
      WHERE Name = 'QObject'
    `);

    const table = result[0];
    const cols = table?.columns; // string[]
    const values = table?.values; // [number | string | Uint8Array | null][];

    if (cols && values) {
      for (const row of values) {
        console.log(row);
      }

      console.log(cols);
    }

    // console.log(result);
    console.log("onSearch", keyword);

    this._comm.postDataReply(cmd, { status: 'done' });
  };
}
