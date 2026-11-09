// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import * as vscode from 'vscode';

import { DisposableStore } from 'qt-lib';
import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { QtProfilerCommandReply } from '@/webview/shared/qt-profiler';
import { QtProfilerDoc } from './doc';

export class QtProfilerController {
  private readonly _dispatcher: WebviewDispatcher;
  private readonly _disposables = new DisposableStore();

  public constructor(
    private readonly _doc: QtProfilerDoc,
    private readonly _panel: vscode.WebviewPanel,
    private readonly _qtProfilerDistDirUri: vscode.Uri
  ) {
    this._dispatcher = new WebviewDispatcher('qt-profiler', this._panel);
    this._dispatcher.setHandlers([
      [CommandId.QtProfilerGetConfig, this._onGetConfig],
      [CommandId.QtProfilerReadBytes, this._onReadBytes]
    ]);

    this._disposables.push(this._dispatcher);
  }

  public dispose() {
    this._disposables.dispose();
  }

  private readonly _onGetConfig = (cmd: Command) => {
    const pathAbs = this._doc.uri.fsPath;

    this._reply(cmd, {
      filePath: pathAbs,
      fileName: path.basename(pathAbs),
      distDir: this._panel.webview
        .asWebviewUri(this._qtProfilerDistDirUri)
        .toString()
    });
  };

  private readonly _onReadBytes = (cmd: Command) => {
    this._reply(cmd, {
      filePath: this._doc.uri.fsPath,
      bytes: new Uint8Array(this._doc.readAll())
    });
  };

  private _reply(cmd: Command, data: QtProfilerCommandReply) {
    this._dispatcher.channel.replyData(cmd, data);
  }
}
