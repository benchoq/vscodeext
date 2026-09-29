// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';

import { DisposableStore } from 'qt-lib';
import { WebAppId } from '@/webview/shared/types';
import { setupWebApp, createPanel } from '@/webview/utils';
import { QtBrowserDispatcher } from './dispatcher';
import * as consts from './constants';

const appId: WebAppId = 'qt-browser';
let instance: QtBrowserController | undefined;

export function addQtBrowser(context: Context) {
  const openCmd = 'openQtBrowser';
  const openCmdFull = `${consts.EXTENSION_ID}.${openCmd}`;

  context.subscriptions.push(
    commands.registerCommand(openCmdFull, () => {
      // telemetry.sendAction(openCmd);
      QtBrowserController.render(context);
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

    this._dispatcher = new QtBrowserDispatcher(context, this._panel);
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
  }

  public static restore(context: Context, panel: Panel) {
    if (instance) {
      panel.dispose();
      return;
    }

    instance = new QtBrowserController(context, panel);
  }
}
