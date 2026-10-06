// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  ExtensionContext as Context,
 } from 'vscode';
import {
  ServerResponse as HttpResponse,
  IncomingMessage as HttpRequest
} from 'http';

import { RequestHandler, sendForbidden } from './handlers/handler-utils';
import { CssOverrideHandler } from './handlers/handler-style';
import { ScriptInjectionHandler } from './handlers/handler-script';
import { FallbackHandler } from './handlers/handler-fallback';
import { fsFile } from '@/fs-utils';

export class QtBrowserDocServerDispatcher {
  private readonly _handlers: RequestHandler[] = [];
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

  public dispatch(req: HttpRequest, res: HttpResponse) {
    const filePath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '');
    const fileName = path.basename(filePath);

    if (!isValidFile(filePath)) {
      sendForbidden(res, filePath);
      return;
    }

    const c = { filePath, fileName, res };
    const handler = this._handlers.find((h) => h.canHandle(c));
    handler?.handle(c);
  }
}

// helper
function isValidFile(filePath: string): boolean {
  return fsFile(filePath).exists();
}
