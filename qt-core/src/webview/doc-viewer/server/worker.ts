// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  ServerResponse as HttpRes,
  IncomingMessage as HttpReq
} from 'http';
import {
  workspace,
  Disposable,
  RelativePattern,
  ExtensionMode as Mode,
  ExtensionContext as Context,
 } from 'vscode';

import { fsFile } from '@/fs-utils';
import { DisposableStore, createWrappedLogger } from 'qt-lib';
import {
  type HandlerFunc,
  replaceCss,
  injectScriptToHtml,
  handleFallback,
} from './handler';
import { HttpContext, sendForbidden } from './common';

const logger = createWrappedLogger('doc-viewer-http-worker');

export class DocViewerHttpWorker implements Disposable {
  private _cssContent = '';
  private readonly _cssDir: string;
  private readonly _cssFileName: string;

  private readonly _handlers: HandlerFunc[] = [];
  private readonly _disposables = new DisposableStore();

  constructor(
    private readonly _context: Context,
    private readonly _onCssChanged: () => void
  ) {
    this._cssDir = path.join(this._context.extensionPath, 'res/others');
    this._cssFileName = 'qt-doc-styles.css';
    this._loadCss();

    if (this._context.extensionMode === Mode.Development) {
      this._watchCssFile();
    }

    this._handlers.push(
      (c: HttpContext) => replaceCss(c, this._cssContent),
      injectScriptToHtml,
      handleFallback,
    )
  }

  public dispose() {
    this._disposables.dispose();
  }

  public dispatch(req: HttpReq, res: HttpRes) {
    const filePath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '');
    const c: HttpContext = {
      req: {
        filePath,
        fileName: path.basename(filePath)
      },
      res,
      logger
    };

    if (!canAccess(filePath)) {
      sendForbidden(c);
      return;
    }

    for (const handler of this._handlers) {
      if (handler(c)) {
        return;
      }
    }
  }

  private _loadCss() {
    const f = fsFile(this._cssDir, this._cssFileName);
    this._cssContent = f.exists() ? String(f.readAll()) : '';
  }

  private _watchCssFile() {
    const pat = new RelativePattern(this._cssDir, this._cssFileName);
    const watcher = workspace.createFileSystemWatcher(pat);

    this._disposables.push(
      watcher,
      watcher.onDidChange(() => {
        this._loadCss();
        this._onCssChanged();
      })
    );
  }
}

// helper
function canAccess(filePath: string): boolean {
  // TODO: filter by ext, etc.
  return fsFile(filePath).exists();
}
