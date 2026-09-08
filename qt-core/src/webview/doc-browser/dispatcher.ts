// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  Disposable,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';

import { createLogger } from 'qt-lib';
import { WebviewChannel } from '@/webview/channel';
import {
  Command,
  CommandId,
  CommandHandler,
  IsCommand
} from '@/webview/shared/message';
import { QchReader } from './qch-reader';

// import {} from '@/webview/shared/doc-browser';
// import * as texts from '@/texts';

const logger = createLogger('doc-browser-dispatcher');

export class DocBrowserDispatcher {
  private readonly _qchReaderPromise: Promise<QchReader>;
  private readonly _comm: WebviewChannel;
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  // private readonly _viewConfig: ExBrowserViewConfig;
  private readonly _disposables: Disposable[] = [];

  public constructor(
    private readonly _context: Context,
    panel: Panel,
  ) {
    void this._context;

    const qchPath = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1/qtcore.qch';
    this._qchReaderPromise = QchReader.create(qchPath);

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
    const reader = await this._qchReaderPromise;
    const result = reader.execToRecords(
      'SELECT * FROM IndexTable WHERE Name LIKE ?',
      [`%${keyword}%`]
    );

    console.log(result);
    console.log("onSearch", keyword);

    this._comm.postDataReply(cmd, { status: 'done' });
  };
}
