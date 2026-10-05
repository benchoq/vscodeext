// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { WebviewDispatcher, WebviewDispatcherChain } from '@/webview/dispatcher';
import { QtBrowserDispatcher } from '@/webview/qt-browser/dispatcher';
import { QtBrowserLocalServer } from '@/webview/qt-browser/server/local-server';
import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcherChain {
  private readonly _localServer: QtBrowserLocalServer;

  public constructor(extContext: ExtContext, panel: Panel) {
    super();

    this._localServer = new QtBrowserLocalServer();
    void this._localServer.start();

    this.appendDispatchers(
      new QtBrowserDispatcher(extContext, panel, this._localServer),
      new QtHelpOwnDispatcher(panel)
    )
  }
}

class QtHelpOwnDispatcher extends WebviewDispatcher {
  public constructor(panel: Panel) {
    super(consts.AppId, panel);
    this.setHandlers([
    ]);
  }
}
