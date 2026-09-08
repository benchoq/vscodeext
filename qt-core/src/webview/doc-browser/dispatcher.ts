// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as path from 'path';
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
import { isIndexData } from '../shared/doc-browser';
import { fsFile } from '@/fs-utils';

// import {} from '@/webview/shared/doc-browser';
// import * as texts from '@/texts';

const logger = createLogger('doc-browser-dispatcher');
const qchDir = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

export class DocBrowserDispatcher {
  private readonly _comm: WebviewChannel;
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  // private readonly _viewConfig: ExBrowserViewConfig;
  private readonly _data: DocBrowserDataManager;
  private readonly _disposables: Disposable[] = [];

  public constructor(
    private readonly _context: Context,
    private readonly _panel: Panel,
  ) {
    void this._context;

    this._data = new DocBrowserDataManager();

    this._comm = new WebviewChannel(_panel.webview);
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.DocBrowserSearch, this._onSearch],
      [CommandId.DocBrowserOpen, this._onOpen]
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
    const data = await this._data.searchIndex(keyword);

    this._comm.postDataReply(cmd, data);
  };

  private readonly _onOpen = (cmd: Command) => {
    const entry = _.get(cmd.payload, 'entry', {});
    if (!isIndexData(entry)) {
      console.log('bad data');
      return;
    }

    const fullPath = path.join(qchDir, entry.folderName, entry.fileName);
    const folderUri = Uri.file(path.dirname(fullPath));
    const baseUri = this._panel.webview.asWebviewUri(folderUri);

    const rawHtml = String(fsFile(fullPath).readAll());
    const cssContent = String(
      fsFile(folderUri, 'style/offline-dark.css').readAll()
    );

    const headContent = `
      <meta charset="utf-8">
      <base href="${baseUri.toString() + '/'}">
      <style>${cssContent}</style>
    `;

    const bodyMatch = new RegExp(/<body[^>]*>([\s\S]*)<\/body>/i).exec(rawHtml)
    const bodyContent = bodyMatch ? bodyMatch[0] : rawHtml;

    const html = `
      <!DOCTYPE html>
      <html>
        ${headContent}
        ${bodyContent}
      </html>
    `;

    this._comm.postDataReply(cmd, {
      html,
    });
  };
}
