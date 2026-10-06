// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { WebviewDispatcher, WebviewDispatcherChain } from '@/webview/dispatcher';
import { QtBrowserDispatcher } from '@/webview/qt-browser/dispatcher';
import { QtBrowserDocServer } from '@/webview/qt-browser/server/doc-server';
import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcherChain {
  private readonly _docServer: QtBrowserDocServer;
  private readonly _viewerDispatcher: QtBrowserDispatcher;

  public constructor(extContext: ExtContext, panel: Panel) {
    super();

    this._docServer = new QtBrowserDocServer(extContext);
    void this._docServer.start();

    this._viewerDispatcher = new QtBrowserDispatcher(
      extContext, panel, this._docServer, {
        trigger: "qt-help",
        syncPanelTitle: false
      }
    );

    this.appendDispatchers(
      this._viewerDispatcher,
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
