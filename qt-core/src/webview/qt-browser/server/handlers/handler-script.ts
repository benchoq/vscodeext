// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';

import { getScriptToInject } from './script';
import {
  RequestContext,
  RequestHandler,
  sendNotFound,
  getMimeType
 } from './handler-utils';

export class ScriptInjectionHandler implements RequestHandler {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  canHandle(c: RequestContext): boolean {
    return c.fileName.endsWith('.html');
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  handle(c: RequestContext): void {
    fs.readFile(c.filePath, (err, data) => {
      if (err) {
        sendNotFound(c.res, c.filePath);
        return;
      }

      const html = String(data).replace(
        '</body>',
        `${getScriptToInject()}</body>`
      );

      c.res.writeHead(200, { 'Content-Type': getMimeType(c.filePath) });
      c.res.end(html);
    });
  }
}

