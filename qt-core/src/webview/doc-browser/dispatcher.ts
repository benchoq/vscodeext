// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  Uri,
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
import { DocBrowserDataManager } from './data-manager';
import { DocBrowserLocalServer } from './local-server';
import { isFullTextSearchData, isIndexData, isTocEntry } from '../shared/doc-browser';

// import {} from '@/webview/shared/doc-browser';
// import * as texts from '@/texts';

const logger = createLogger('doc-browser-dispatcher');
// const qchDir = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

export class DocBrowserDispatcher {
  private readonly _comm: WebviewChannel;
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  private readonly _data: DocBrowserDataManager;
  private readonly _disposables: Disposable[] = [];

  public constructor(
    private readonly _context: Context,
    private readonly _panel: Panel,
    private readonly _server: DocBrowserLocalServer
  ) {
    void this._context;
    void this._panel;

    this._data = new DocBrowserDataManager();

    this._comm = new WebviewChannel(_panel.webview);
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.DocBrowserReadToc, this._onReadToc],
      [CommandId.DocBrowserSearch, this._onSearch],
      [CommandId.DocBrowserOpenDocFromToc, this._onOpenFromToc],
      [CommandId.DocBrowserOpenDocFromIndex, this._onOpenFromIndex],
      [CommandId.DocBrowserOpenDocFromFullText, this._onOpenFromFullText]
    ]);

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
  private readonly _onReadToc = async (cmd: Command) => {
    const data = await this._data.readToc();
    this._comm.postDataReply(cmd, data);
  };

  private readonly _onSearch = async (cmd: Command) => {
    const mode = String(_.get(cmd.payload, 'mode', '')).trim();
    const keyword = String(_.get(cmd.payload, 'keyword', '')).trim();
    if (mode === 'index') {
      const data = await this._data.searchIndex(keyword);
      this._comm.postDataReply(cmd, data);
    } else {
      const data = await this._data.searchFullText(keyword);
      this._comm.postDataReply(cmd, data);
    }
  };

  private readonly _onOpenFromToc = (cmd: Command) => {
    const toc = _.get(cmd.payload, 'toc', {});
    if (!isTocEntry(toc)) {
      console.log('bad data');
      return;
    }

    const uri = Uri
      .file(toc.filePathRel)
      .with({
        scheme: this._server.scheme,
        authority: `${this._server.host}:${String(this._server.port ?? 0)}`,
      });

    // http://127.0.0.1/qtcore/qobject.html
    this._comm.postDataReply(cmd, { htmlUri: uri.toString() });
  }

  private readonly _onOpenFromIndex = (cmd: Command) => {
    const index = _.get(cmd.payload, 'index', {});
    if (!isIndexData(index)) {
      console.log('bad data');
      return;
    }

    const uri = Uri
      .file(index.filePathRel)
      .with({
        scheme: this._server.scheme,
        authority: `${this._server.host}:${String(this._server.port ?? 0)}`,
      });

    this._comm.postDataReply(cmd, { htmlUri: uri.toString() });
  };

  private readonly _onOpenFromFullText = (cmd: Command) => {
    const data = _.get(cmd.payload, 'search', {});
    if (!isFullTextSearchData(data)) {
      console.log('bad data');
      return;
    }

    const uri = Uri
      .file(data.filePathRel)
      .with({
        scheme: this._server.scheme,
        authority: `${this._server.host}:${String(this._server.port ?? 0)}`,
      });

    this._comm.postDataReply(cmd, { htmlUri: uri.toString() });
  };
}
