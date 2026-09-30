// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  workspace,
  Disposable,
  EventEmitter,
  RelativePattern,
  ExtensionMode as Mode,
  ExtensionContext as Context,
} from 'vscode';

import { fsFile } from '@/fs-utils';
import { DisposableStore } from 'qt-lib';

export class QtBrowserDocStyleProvider implements Disposable {
  private _cssLines = '';
  private readonly _cssChangedEmitter = new EventEmitter<string>();
  private readonly _disposables = new DisposableStore();

  public constructor(
    private readonly _context: Context,
  ) {
    this._loadCss();

    if (this._context.extensionMode === Mode.Development) {
      const [ dir, name ] = this._cssFileInfo();
      const pat = new RelativePattern(dir, name);
      const watcher = workspace.createFileSystemWatcher(pat);

      this._disposables.push(
        watcher,
        watcher.onDidChange(() => {
          this._loadCss();
          this._cssChangedEmitter.fire(this._cssLines);
        })
      );
    }
  }

  public dispose() {
    this._disposables.dispose();
  }

  get cssLines() {
    return this._cssLines;
  }

  get onCssChanged() {
    return this._cssChangedEmitter.event;
  }

  // private
  private _loadCss() {
    const css = fsFile(...this._cssFileInfo());
    this._cssLines = css.exists()
      ? String(css.readAll())
      : '';
  }

  private _cssFileInfo(): [string, string] {
    return [
      path.join(this._context.extensionPath, 'res/others'),
      'qt-doc-styles.css'
    ]
  }
}
