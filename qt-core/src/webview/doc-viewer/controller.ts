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
import { QtBrowserDocServer } from './server/doc-server';
import * as consts from './constants';
import { QtBrowserOpenOptions } from '../shared/doc-viewer';

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
  private readonly _sessions = new Set<QtBrowserSession>();
  private readonly _docServer: QtBrowserDocServer;
  private readonly _disposables = new DisposableStore();

  constructor(context: Context) {
    this._docServer = new QtBrowserDocServer(context);
    void this._docServer.start();
  }

  dispose() {
    this._disposables.dispose();
  }

  public open(context: Context, uri?: Uri, o?: QtBrowserOpenOptions) {
    const col = o?.trigger === 'ex-browser'
      ? this._getLastActiveColumn(ViewColumn.Beside)
      : undefined;

    if (o?.forceNewWindow !== true) {
      const existing = uri && this._find(uri);
      if (existing) {
        existing.reveal(col);
        return;
      }
    }

    const openOptions: QtBrowserOpenOptions = {
      ...(o ?? {}),
      ...(uri && { homeUrl: uri.toString() })
    };

    const s = this._add(context, openOptions);
    s.reveal(col);
  }

  private _add(context: Context, openOptions: QtBrowserOpenOptions) {
    const panel = createPanel(consts.AppId);
    const s = new QtBrowserSession(context, panel, this._docServer, openOptions);

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
}
