// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import * as http from 'http';
import {
  ExtensionContext as Context,
 } from 'vscode';

import { fsFile } from '@/fs-utils';
import { Handler, HandlerContext, sendForbidden } from './handlers/common';
import { FallbackHandler } from './handlers/fallback';
import { CssOverrideHandler } from './handlers/css-override';
import { ScriptInjectionHandler } from './handlers/script-injection';

export class QtBrowserDocServerDispatcher {
  private readonly _handlers: Handler[] = [];
  private readonly _cssHandler: CssOverrideHandler;

  constructor(
    private readonly _context: Context,
    onCssChanged: () => void
  ) {
    this._cssHandler = new CssOverrideHandler(this._context, onCssChanged);

    this._handlers.push(
      this._cssHandler,
      new ScriptInjectionHandler(),
      new FallbackHandler()
    );

    // TODO: dispose
  }

  public dispatch(req: http.IncomingMessage, res: http.ServerResponse) {
    const filePath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '');
    const c: HandlerContext = {
      http: { req, res },
      parsed: {
        filePath,
        fileName: path.basename(filePath)
      }
    };

    const handler = this._handlers.find((h) => h.canHandle(c));
    if (!canAccess(filePath) || !handler) {
      sendForbidden(c);
      return;
    }

    handler.handle(c);
  }
}

// helper
function canAccess(filePath: string): boolean {
  // TODO: filter by ext, etc.
  return fsFile(filePath).exists();
}
