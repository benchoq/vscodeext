// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { QtBrowserDispatcher } from '@/webview/qt-browser/dispatcher';
import { QtBrowserLocalServer } from '@/webview/qt-browser/server/local-server';
import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcher {
  private readonly _localServer: QtBrowserLocalServer
  private readonly _browserDispatcher: QtBrowserDispatcher;

  public constructor(
    extContext: ExtContext,
    panel: Panel,
  ) {
    super(consts.AppId, panel);

    this._localServer = new QtBrowserLocalServer();
    void this._localServer.start();

    this._browserDispatcher = new QtBrowserDispatcher(extContext, panel, this._localServer);

    void extContext;
    this.setHandlers([
      [CommandId.QtBrowserGetConfig, this._relay],
      [CommandId.QtBrowserSetTitle, this._relay],
      [CommandId.QtBrowserOpenUriExt, this._relay],
      [CommandId.QtBrowserGetBookmarks, this._relay],
      [CommandId.QtBrowserEditBookmarks, this._relay],
    ]);
  }

  public override dispose() {
    super.dispose();
  }

  private readonly _relay = async (cmd: Command) => {
    await this._browserDispatcher.dispatch(cmd);
  };
}
