// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  window,
  Uri,
  Range,
  Position,
  ViewColumn,
  WebviewPanel as Panel
} from 'vscode';

import {
  exists,
  createWrappedLogger,
  FileFinder,
  DisposableStore
 } from 'qt-lib';
import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { QtProfilerCommandReply } from '@/webview/shared/qt-profiler';
import { QtProfilerDoc } from './doc';

const logger = createWrappedLogger('qtprofiler-controller');

export class QtProfilerController {
  private readonly _dispatcher: WebviewDispatcher;
  private readonly _disposables = new DisposableStore();

  public constructor(
    private readonly _doc: QtProfilerDoc,
    private readonly _panel: Panel,
    private readonly _qtProfilerDistDirUri: Uri,
  ) {
    this._dispatcher = new WebviewDispatcher('qt-profiler', this._panel);
    this._dispatcher.setHandlers([
      [CommandId.QtProfilerGetConfig, this._onGetConfig],
      [CommandId.QtProfilerReadBytes, this._onReadBytes],
      [CommandId.QtProfilerEventSelected, this._onEventSelected]
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
    })
  };

  private readonly _onReadBytes = (cmd: Command) => {
    this._reply(cmd, {
      filePath: this._doc.uri.fsPath,
      bytes: new Uint8Array(this._doc.readAll())
     });
  };

  private readonly _onEventSelected = (cmd: Command) => {
    // method: 'traceEventSelected',
    // params: {
    //   columnNumber: number,
    //   lineNumber: number,
    //   sourceFilePath: string
    // }

    console.log("+++++++++++++++++++++");
    console.log(cmd.payload);

    void openSourceFile(cmd.payload as Record<string, unknown>);
    this._reply(cmd, { status: 'done' });
  }

  private _reply(cmd: Command, data: QtProfilerCommandReply) {
    this._dispatcher.channel.replyData(cmd, data);
  }
}


// helpers
async function openSourceFile(params: Record<string, unknown>) {
  // const qmlApi = await getQtQmlApi();
  // const dirs = qmlApi?.traceFile.getAdditionalDirs(uri);
  // if (!dirs || dirs.length === 0) {
  //   logger.text('Cannot locate QML file, no additionalDirs assigned').info();
  //   return;
  // }

  const dirs = [
    // '/Users/bencho/tools/Qt/Examples/Qt-6.11.1/demos/robotarm',
    '/Users/bencho/ws_temp/robot-arm'
  ];

  const line = parseInt(parseString(params.lineNumber));
  const column = parseInt(parseString(params.columnNumber));
  const filePath = parseString(params.sourceFilePath);
  if (!filePath.toLowerCase().endsWith('.qml')) {
    return;
  }

  const finder = new FileFinder();
  finder.buildDirs = dirs;

  const fsFilePath = await finder.findFile(filePath);
  if (!fsFilePath) {
    logger
      .text('Cannot resolve QML file')
      .data('filePath', filePath)
      .error();
    return;
  }

  if (!(await exists(fsFilePath))) {
    logger
      .text('Cannot open QML file')
      .data('exist', 'false')
      .data('qml-file', fsFilePath)
      .error();
    return;
  }

  const uri = Uri.file(fsFilePath);
  const pos = new Position(Math.max(0, line - 1), Math.max(0, column - 1));

  void window.showTextDocument(uri, {
    viewColumn: ViewColumn.Two,
    selection: new Range(pos, pos),
    preview: true
  });
}

function parseString(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value.trim();

    case 'number':
      return String(value);

    default:
      return '';
  }
}
