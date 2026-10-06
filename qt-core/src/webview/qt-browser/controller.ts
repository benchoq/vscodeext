// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  Uri,
  ExtensionContext as Context,
  ViewColumn,
} from 'vscode';

import { telemetry, DisposableStore } from 'qt-lib';
import { createPanel } from '@/webview/utils';
import { QtBrowserSession } from './session';
import { QtBrowserLocalServer } from './server/local-server';
import { QtBrowserDocStyleProvider } from './server/style-provider';
import * as consts from './constants';
import { QtBrowserOpenOptions } from '../shared/qt-browser';

let controller: QtBrowserController | undefined;

export function addQtBrowser(context: Context) {
  const openCmd = 'openQtBrowser';
  const openCmdFull = `${consts.EXTENSION_ID}.${openCmd}`;

  controller = new QtBrowserController(context);

  context.subscriptions.push(
    commands.registerCommand(openCmdFull, (uri?: Uri, o?: QtBrowserOpenOptions) => {
      telemetry.sendAction(openCmd);
      controller?.open(context, uri, o);
    })
  );
}

export class QtBrowserController {
  private readonly _cssProvider: QtBrowserDocStyleProvider;
  private readonly _sessions = new Set<QtBrowserSession>();
  private readonly _localServer = new QtBrowserLocalServer();
  private readonly _disposables = new DisposableStore();

  constructor(context: Context) {
    this._cssProvider = new QtBrowserDocStyleProvider(context);

    this._disposables.push(
      this._cssProvider,
      this._cssProvider.onCssChanged((css: string) => {
        this._loadCss(css);
      })
    )

    void this._localServer.start().then(() => {
      this._loadCss(this._cssProvider.cssLines);
    });
  }

  dispose() {
    this._disposables.dispose();
  }

  public open(context: Context, uri?: Uri, o?: QtBrowserOpenOptions) {
    const col = o?.trigger === 'ex-browser'
      ? this._getLastActiveColumn(ViewColumn.Beside)
      : undefined;

    const existing = uri && this._find(uri);

    console.log("++++++++ col =", col);
    console.log("++++++++ existing =", existing, uri);

    if (existing) {
      existing.reveal(col);
      return;
    }

    const s = this._add(context);
    s.setHomeUri(uri?.toString() ?? '');
    s.reveal(col);
  }

  private _add(context: Context) {
    const panel = createPanel(consts.AppId);
    const s = new QtBrowserSession(context, panel, this._localServer);

    this._disposables.push(
      // TODO
      panel.onDidChangeViewState((e) => {
        if (e.webviewPanel.active) {
          this._sessions.delete(s);
          this._sessions.add(s); // to track the last active one
        }
      }),

      panel.onDidDispose(() => {
        this._sessions.delete(s);
      })
    );

    this._sessions.add(s);
    return s;
  }

  private _find(uri: Uri) {
    for (const c of this._sessions) {
      if (c.currentUri === uri.toString()) {
        return c;
      }
    }

    return undefined;
  }

  private _getLastActiveColumn(fallback: ViewColumn) {
    const s = [...this._sessions].at(-1);
    return s?.viewColumn ?? fallback;
  }

  private _loadCss(css: string) {
    this._localServer.setCssOverride(css);

    for (const c of this._sessions.values()) {
      c.reloadPage();
    }
  }
}
