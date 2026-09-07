// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  window,
  commands,
  Disposable,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';

// import { telemetry } from 'qt-lib';
import {
  WebviewAppConfig,
  createWebviewHtml,
  createWebviewOptions,
  basicWebviewAppConfig,
  createWebviewPanelIcons,
} from '@/webview/utils';
import { DocBrowserDispatcher } from './dispatcher';
import * as consts from './constants';

export function registerDocBrowser(context: Context) {
  context.subscriptions.push(
    commands.registerCommand(consts.COMMAND_FULL_OPEN, () => {
      // telemetry.sendAction(consts.COMMAND_OPEN);
      DocBrowserController.render(context);
    })
  );
}

export class DocBrowserController {
  public static instance: DocBrowserController | undefined;

  private readonly _panel: Panel;
  private readonly _dispatcher: DocBrowserDispatcher;
  private readonly _disposables: Disposable[] = [];

  private constructor(context: Context, panel: Panel) {
    const config: WebviewAppConfig = {
      app: 'doc-browser',
      title: 'Qt documentation',
      context,
      ...basicWebviewAppConfig
    };

    panel.iconPath = createWebviewPanelIcons(context);
    panel.webview.html = createWebviewHtml(panel.webview, config);
    panel.webview.options = createWebviewOptions(config);

    this._panel = panel;
    this._dispatcher = new DocBrowserDispatcher(context, panel);
    this._disposables = [
      this._dispatcher,
      panel.onDidDispose(this.dispose.bind(this))
    ];
  }

  public dispose() {
    DocBrowserController.instance = undefined;
    this._disposables.forEach((d) => void d.dispose());
    this._disposables.length = 0;
  }

  public static render(context: Context) {
    if (!DocBrowserController.instance) {
      DocBrowserController.instance = new DocBrowserController(
        context,
        window.createWebviewPanel(
          consts.WEBVIEW_PANEL_VIEW_TYPE,
          'Qt documentation',
          consts.WEBVIEW_PANEL_COLUMN
        )
      );
    }

    DocBrowserController.instance._panel.reveal(consts.WEBVIEW_PANEL_COLUMN);
  }

  public static restore(context: Context, panel: Panel) {
    if (DocBrowserController.instance) {
      panel.dispose();
      return;
    }

    DocBrowserController.instance = new DocBrowserController(context, panel);
  }
}
