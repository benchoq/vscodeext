// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  workspace,
  Disposable,
  RelativePattern,
  ExtensionMode as Mode,
  ExtensionContext as Context,
} from 'vscode';

import { fsFile } from '@/fs-utils';
import { DisposableStore } from 'qt-lib';
import { HandlerContext, Handler, sendData } from './common';

export class CssOverrideHandler implements Handler, Disposable {
  private _content = '';

  private readonly _fileDir: string;
  private readonly _fileName: string;
  private readonly _disposables = new DisposableStore();

  constructor(
    context: Context,
    private readonly _onChanged: () => void
  ) {
    this._fileDir = path.join(context.extensionPath, 'res/others');
    this._fileName = 'qt-doc-styles.css';

    if (context.extensionMode === Mode.Development) {
      this._watchCssFile();
    }

    this._loadCss();
  }

  public dispose() {
    this._disposables.dispose();
  }

  public canHandle(c: HandlerContext): boolean {
    return this._content.length !== 0 &&
      c.parsed.fileName.startsWith('offline') &&
      c.parsed.fileName.endsWith('.css');
  }

  public handle(c: HandlerContext) {
    sendData(c, this._content);
  }

  private _loadCss() {
    const f = fsFile(this._fileDir, this._fileName);
    this._content = f.exists() ? String(f.readAll()) : '';
  }

  private _watchCssFile() {
    const pat = new RelativePattern(this._fileDir, this._fileName);
    const watcher = workspace.createFileSystemWatcher(pat);

    this._disposables.push(
      watcher,
      watcher.onDidChange(() => {
        this._loadCss();
        this._onChanged();
      })
    );
  }
}
