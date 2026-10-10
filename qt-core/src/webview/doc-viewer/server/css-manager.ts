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

export class DocViewerCssManager implements Disposable {
  private _content = '';
  private readonly _dir: string;
  private readonly _fileName: string;
  private readonly _disposables = new DisposableStore();

  constructor(
    private readonly _context: Context,
    private readonly _onChanged: () => void
  ) {
    this._dir = path.join(this._context.extensionPath, 'res/others');
    this._fileName = 'qt-doc-styles.css';

    if (this._context.extensionMode === Mode.Development) {
      const pat = new RelativePattern(this._dir, this._fileName);
      const watcher = workspace.createFileSystemWatcher(pat);

      this._disposables.push(
        watcher,
        watcher.onDidChange(() => {
          this._loadCss();
          this._onChanged();
        })
      );
    }

    this._loadCss();
  }

  public dispose() {
    this._disposables.dispose();
  }

  public get cssContent() {
    return this._content;
  }

  private _loadCss() {
    const f = fsFile(this._dir, this._fileName);
    this._content = f.exists() ? String(f.readAll()) : '';
  }
}

