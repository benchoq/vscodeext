// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  ViewColumn,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';

import { DisposableStore } from 'qt-lib';
import { setupWebApp } from '@/webview/utils';
import { QtBrowserLocalServer } from './server/local-server';
import { QtBrowserDispatcher } from './dispatcher';
import * as consts from './constants';
import { QtBrowserOpenOptions } from '../shared/qt-browser';

export class QtBrowserSession {
  private readonly _dispatcher: QtBrowserDispatcher;
  private readonly _disposables = new DisposableStore();

  constructor(
    context: Context,
    private readonly _panel: Panel,
    localServer: QtBrowserLocalServer
  ) {
    setupWebApp(consts.AppId, context, this._panel);

    this._dispatcher = new QtBrowserDispatcher(
      context, this._panel, localServer
    );

    this._disposables.push(
      this._dispatcher,
      this._panel.onDidDispose(this.dispose.bind(this)),
    );
  }

  public dispose() {
    this._disposables.dispose();
  }

  public get currentUri() {
    return this._dispatcher.currentUri;
  }

  public get viewColumn() {
    return this._panel.viewColumn;
  }

  public reveal(viewColumn?: ViewColumn, preserveFocus?: boolean) {
    this._panel.reveal(viewColumn, preserveFocus);

    // to remove preview mode
    void commands.executeCommand('workbench.action.keepEditor');
  }

  public setHomeUri(uri: string) {
    this._dispatcher.setHomeUri(uri);
  }

  public setOpenOptions(o: QtBrowserOpenOptions) {
    this._dispatcher.setOpenOptions(o);
  }

  public reloadPage() {
    this._dispatcher.notifyReload();
  }
}
