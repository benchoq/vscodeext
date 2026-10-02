// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  Uri,
  ExtensionContext as Context
} from 'vscode';

import { DisposableStore } from 'qt-lib';
import { createPanel } from '@/webview/utils';
import { QtBrowserSession } from './session';
import { QtBrowserLocalServer } from './server/local-server';
import { QtBrowserDocStyleProvider } from './server/style-provider';
import * as consts from './constants';

export class QtBrowserController {
  private _cssProvider: QtBrowserDocStyleProvider | undefined;

  private readonly _sessions = new Set<QtBrowserSession>();
  private readonly _localServer = new QtBrowserLocalServer();
  private readonly _disposables = new DisposableStore();

  dispose() {
    this._disposables.dispose();
  }

  public init(context: Context) {
    this._cssProvider = new QtBrowserDocStyleProvider(context);

    this._disposables.push(
      this._cssProvider,
      this._cssProvider.onCssChanged((css: string) => {
        this._loadCss(css);
      })
    )

    void this._localServer.start().then(() => {
      this._loadCss(this._cssProvider?.cssLines ?? '');
    });
  }

  public open(context: Context, uri?: Uri) {
    const existing = uri && this._find(uri);
    if (existing) {
      existing.reveal();
      return;
    }

    const s = this._add(context);
    s.reveal();
  }

  private _add(context: Context) {
    const panel = createPanel(consts.appId);
    const s = new QtBrowserSession(context, panel, this._localServer);

    this._sessions.add(s);
    panel.onDidDispose(() => {
      this._sessions.delete(s);
    });

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

  private _loadCss(css: string) {
    this._localServer.setCssOverride(css);

    for (const c of this._sessions.values()) {
      c.reloadPage();
    }
  }
}
