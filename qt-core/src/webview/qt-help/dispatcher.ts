// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { WebviewDispatcher, WebviewDispatcherChain } from '@/webview/dispatcher';
import { QtBrowserDispatcher } from '@/webview/qt-browser/dispatcher';
import { QtBrowserLocalServer } from '@/webview/qt-browser/server/local-server';
import { QtBrowserDocStyleProvider } from '@/webview/qt-browser/server/style-provider';
import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcherChain {
  private readonly _localServer: QtBrowserLocalServer;
  private readonly _cssProvider: QtBrowserDocStyleProvider;
  private readonly _viewerDispatcher: QtBrowserDispatcher;

  public constructor(extContext: ExtContext, panel: Panel) {
    super();

    this._cssProvider = new QtBrowserDocStyleProvider(extContext);
    this._localServer = new QtBrowserLocalServer();
    void this._localServer.start().then(() => {
      this._loadCss(this._cssProvider.cssLines);
    });

    this._viewerDispatcher = new QtBrowserDispatcher(
      extContext, panel, this._localServer, {
        trigger: "qt-help",
        syncPanelTitle: false
      }
    );

    this.appendDispatchers(
      this._viewerDispatcher,
      new QtHelpOwnDispatcher(panel)
    )
  }

  private _loadCss(css: string) {
    this._localServer.setCssOverride(css);
    this._viewerDispatcher.notifyReload();
  }
}

class QtHelpOwnDispatcher extends WebviewDispatcher {
  public constructor(panel: Panel) {
    super(consts.AppId, panel);
    this.setHandlers([
    ]);
  }
}
