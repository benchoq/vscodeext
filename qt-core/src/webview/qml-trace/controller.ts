// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';

import { normalizeDriveLetter, DisposableStore } from 'qt-lib';
import { Command, CommandId } from '@/webview/shared/message';
import { WebviewDispatcher } from '@/webview/dispatcher';
import { QmlTraceCommandReply } from '@/webview/shared/qml-trace';
import { QmlTraceDoc } from './doc';
import * as texts from '@/texts';

export class QmlTraceController {
  private readonly _dispatcher: WebviewDispatcher;
  private readonly _disposables = new DisposableStore();

  public constructor(
    private readonly _doc: QmlTraceDoc,
    private readonly _qtProfilerDistDirUri: vscode.Uri,
    private readonly _panel: vscode.WebviewPanel
  ) {
    this._dispatcher = new WebviewDispatcher('qml-trace', _panel);
    this._dispatcher.setHandlers([
      [CommandId.QmlTraceReadBytes, this._onReadBytes],
      [CommandId.QmlTraceGetConfigs, this._onGetConfigs],
      [CommandId.QmlTraceSetConfigs, this._onSetConfigs],
      [CommandId.QmlTraceSelectFolder, this._onSelectFolder],
      [CommandId.QmlTraceGetWorkspaceFolders, this._onGetWorkspaceFolders]
    ]);

    this._disposables.push(this._dispatcher);
  }

  public dispose() {
    this._disposables.dispose();
  }

  private readonly _onGetConfigs = async (cmd: Command) => {
    this._reply(cmd, {
      filePath: this._doc.uri.fsPath,
      fileName: path.basename(this._doc.uri.fsPath),
      fileUri: this._panel.webview.asWebviewUri(vscode.Uri.file(this._doc.uri.fsPath)).toString(),
      additionalDirs: await this._doc.getAdditionalDirs(),
      distDir: this._panel.webview
        .asWebviewUri(this._qtProfilerDistDirUri)
        .toString()
    })
  };

  private readonly _onReadBytes = (cmd: Command) => {
    this._reply(cmd, {
      filePath: this._doc.uri.fsPath,
      bytes: new Uint8Array(this._doc.readAll())
     });
  };

  private readonly _onSetConfigs = (cmd: Command) => {
    const dirs = _.get(cmd.payload, 'additionalDirs', [] as string[]);
    void this._doc.setAdditionalDirs(dirs);
    this._reply(cmd, { status: 'done' });
  };

  private readonly _onSelectFolder = async (cmd: Command) => {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      canSelectFiles: false,
      canSelectFolders: true,
      openLabel: texts.qmlTrace.folderSelectTitle
    };

    const folderUri = await vscode.window.showOpenDialog(options);
    if (folderUri && folderUri.length > 0) {
      const folder = normalizeDriveLetter(folderUri[0]?.fsPath ?? '');
      this._reply(cmd, { folders: [folder] });
    }
  };

  private readonly _onGetWorkspaceFolders = (cmd: Command) => {
    const folders = (vscode.workspace.workspaceFolders ?? []).map((f) => {
      return f.uri.fsPath;
    });

    this._reply(cmd, { folders });
  };

  private _reply(cmd: Command, data: QmlTraceCommandReply) {
    this._dispatcher.channel.replyData(cmd, data);
  }
}
