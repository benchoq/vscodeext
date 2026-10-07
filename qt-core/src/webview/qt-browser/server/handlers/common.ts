// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import {
  ServerResponse as HttpRes,
  IncomingMessage as HttpReq
} from 'http';

import { createWrappedLogger } from 'qt-lib';
import { createErrorPage } from '../static/error-page';

const logger = createWrappedLogger('qt-browser-doc-server-handler');

export interface HandlerContext {
  http: {
    req: HttpReq;
    res: HttpRes;
  },
  parsed: {
    filePath: string;
    fileName: string;
  }
}

export interface Handler {
  canHandle(c: HandlerContext): boolean;
  handle(c: HandlerContext): void;
}

export function sendData(c: HandlerContext, data: unknown) {
  const headers = {
    'Content-Type': getMimeType(c.parsed.filePath)
  };

  c.http.res.writeHead(200, headers);
  c.http.res.end(data);
}

export function sendNotFound(c: HandlerContext) {
  c.http.res.writeHead(404);
  c.http.res.end(createErrorPage(404));

  logger
    .text('Not found')
    .data({ ...c })
    .error();
}

export function sendForbidden(c: HandlerContext) {
  c.http.res.writeHead(403);
  c.http.res.end(createErrorPage(403));

  logger
    .text('Forbidden')
    .data({ ...c })
    .error();
}

// helpers
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };

  return map[ext] ?? 'application/octet-stream';
}
