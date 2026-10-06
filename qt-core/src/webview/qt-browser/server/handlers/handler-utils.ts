// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as http from 'http';
import * as path from 'path';

import { createWrappedLogger } from 'qt-lib';
import { NotFoundPage } from './not-found';

const logger = createWrappedLogger('qt-browser-doc-server-handler');

export interface RequestContext {
  filePath: string;
  fileName: string;
  res: http.ServerResponse;
}

export interface RequestHandler {
  canHandle(ctx: RequestContext): boolean;
  handle(ctx: RequestContext): void;
}

export function sendNotFound(res: http.ServerResponse, filePath: string) {
  res.writeHead(404);
  res.end(NotFoundPage);
  logger.text('Not found').data({ filePath }).error();
}

export function sendForbidden(res: http.ServerResponse, filePath: string) {
  res.writeHead(403);
  res.end('Forbidden');
  logger.text('Forbidden').data({ filePath }).error();
}

export function getMimeType(filePath: string): string {
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
