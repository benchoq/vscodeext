// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';

import { DisposableStore } from 'qt-lib';
import { setupWebApp } from '@/webview/utils';
import { QtBrowserLocalServer } from './server/local-server';
import { QtBrowserDispatcher } from './dispatcher';
import * as consts from './constants';

export class QtBrowserSession {
  private readonly _dispatcher: QtBrowserDispatcher;
  private readonly _disposables = new DisposableStore();

  constructor(
    context: Context,
    private readonly _panel: Panel,
    localServer: QtBrowserLocalServer
  ) {
    setupWebApp(consts.appId, context, this._panel);

    this._dispatcher = new QtBrowserDispatcher(context, this._panel, localServer);
    this._disposables.push(
      this._dispatcher,
      this._panel.onDidDispose(this.dispose.bind(this))
    );
  }

  public dispose() {
    this._disposables.dispose();
  }

  get currentUri() {
    void this;
    return '';
  }

  public reveal() {
    this._panel.reveal();
  }

  public reloadPage() {
    this._dispatcher.notifyReload();
  }
}
