// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  window,
  commands,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';
import * as path from 'path';

import { telemetry, DisposableStore } from 'qt-lib';
import { fsFile } from '@/fs-utils';
import { WebAppId } from '@/webview/shared/types';
import { getWebAppInfo } from '@/webview/info';
import { setupWebApp, createPanel } from '@/webview/utils';
import { QtBrowserLocalServer } from './local-server';
import { QtBrowserDispatcher } from './dispatcher';
import * as consts from './constants';

const appId: WebAppId = 'qt-browser';
const localServer = new QtBrowserLocalServer();
let instance: QtBrowserController | undefined;

export function addQtBrowser(context: Context) {
  const openCmd = 'openQtBrowser';
  const openCmdFull = `${consts.EXTENSION_ID}.${openCmd}`;
  const info = getWebAppInfo(appId);

  context.subscriptions.push(
    commands.registerCommand(openCmdFull, () => {
      telemetry.sendAction(openCmd);
      QtBrowserController.render(context);
    }),

    window.registerWebviewPanelSerializer(info.viewType, {
      async deserializeWebviewPanel(panel: Panel) {
        QtBrowserController.restore(context, panel);
        return Promise.resolve();
      }
    })
  );
}

class QtBrowserController {
  private readonly _dispatcher: QtBrowserDispatcher;
  private readonly _disposables = new DisposableStore();

  private constructor(
    context: Context,
    private readonly _panel: Panel
  ) {
    setupWebApp(appId, context, this._panel);

    this._dispatcher = new QtBrowserDispatcher(context, this._panel, localServer);
    this._disposables.push(
      this._dispatcher,
      this._panel.onDidDispose(this.dispose.bind(this))
    );
  }

  public dispose() {
    instance = undefined;
    this._disposables.dispose();
  }

  public static render(context: Context) {
    instance ??= new QtBrowserController(context, createPanel(appId));
    instance._panel.reveal();

    void localServer.start().then(() => {
      loadCss(localServer, context);
    });
  }

  public static restore(context: Context, panel: Panel) {
    if (instance) {
      panel.dispose();
      return;
    }

    instance = new QtBrowserController(context, panel);
  }
}

function loadCss(server: QtBrowserLocalServer, context: Context) {
  const css = fsFile(path.join(
    context.extensionPath, 'res/others/doc-styles.css'
  ));

  if (css.exists()) {
    server.setCssOverride(String(css.readAll()));
  }
}
