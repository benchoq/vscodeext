// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';

import {
  RequestContext,
  RequestHandler,
  sendNotFound,
  getMimeType
 } from './handler-utils';

export class FallbackHandler implements RequestHandler {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  canHandle(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  handle(c: RequestContext): void {
    fs.readFile(c.filePath, (err, data) => {
      if (err) {
        sendNotFound(c.res, c.filePath);
        return;
      }

      c.res.writeHead(200, { 'Content-Type': getMimeType(c.filePath) });
      c.res.end(data);
    });
  }
}
