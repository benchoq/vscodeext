// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as path from 'path';
import {
  workspace,
  Disposable,
  WebviewPanel as Panel,
  ExtensionMode as Mode,
  ExtensionContext as Context,
  RelativePattern
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
import { fsFile } from '@/fs-utils';

const logger = createLogger('doc-browser-dispatcher');

export class DocBrowserDispatcher {
  private readonly _comm: WebviewChannel;
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  private readonly _data: DocBrowserDataManager;
  private readonly _disposables: Disposable[] = [];

  public constructor(
    private readonly _context: Context,
    private readonly _panel: Panel,
    private readonly _server: DocBrowserLocalServer | undefined
  ) {
    // TODO
    // TODO: ensure the server instance is always valid
    void this._context;
    void this._panel;

    this._data = new DocBrowserDataManager();

    this._comm = new WebviewChannel(_panel.webview);
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.DocBrowserGetConfig, this._onGetConfig],
      [CommandId.DocBrowserReadToc, this._onReadToc],
      [CommandId.DocBrowserSearch, this._onSearch],
    ]);

    this._loadCss();

    if (this._context.extensionMode === Mode.Development) {
      this._setupCssWatcher();
    }

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
  private readonly _onGetConfig = (cmd: Command) => {
    this._comm.postDataReply(cmd, {
      serverOrigin: this._server?.origin ?? ''
    });
  };

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

  // private
  private _loadCss() {
    const css = fsFile(...this._cssFileInfo());
    if (this._server && css.exists()) {
      this._server.setCssOverride(String(css.readAll()));
    }
  }

  private _setupCssWatcher() {
    const [ dir, name ] = this._cssFileInfo();
    const pat = new RelativePattern(dir, name);
    const watcher = workspace.createFileSystemWatcher(pat);

    this._disposables.push(
      watcher,
      watcher.onDidChange(() => {
        this._loadCss();
        this._comm.post(CommandId.DocBrowserReload, {});
      })
    );
  }

  private _cssFileInfo(): [string, string] {
    return [
      path.join(this._context.extensionPath, 'res/others'),
      'doc-styles.css'
    ]
  }
}
