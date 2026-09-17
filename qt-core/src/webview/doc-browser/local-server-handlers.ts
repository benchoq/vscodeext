// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { createWrappedLogger } from 'qt-lib';

export interface RequestContext {
  filePath: string;
  fileName: string;
  res: http.ServerResponse;
}

const logger = createWrappedLogger('docbrowser-localserver-handler');

export interface RequestHandler {
  canHandle(ctx: RequestContext): boolean;
  handle(ctx: RequestContext): void;
}

export class OfflineCssHandler implements RequestHandler {
  constructor(private readonly _cssPath: string) {}

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  canHandle(c: RequestContext): boolean {
    return c.fileName.startsWith('offline') && c.fileName.endsWith('.css');
  }

  handle(c: RequestContext): void {
    c.res.writeHead(200, { 'Content-Type': 'text/css' });
    c.res.end(fs.readFileSync(this._cssPath));
  }
}

export class HtmlInjectionHandler implements RequestHandler {
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

export class StaticFileHandler implements RequestHandler {
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

export function sendNotFound(res: http.ServerResponse, filePath: string) {
  res.writeHead(404);
  res.end('Not found');
  logger.text('Not found').data({ filePath }).error();
}

export function sendForbidden(res: http.ServerResponse, filePath: string) {
  res.writeHead(403);
  res.end('Forbidden');
  logger.text('Forbidden').data({ filePath }).error();
}


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

function getScriptToInject() {
  return /*html*/ `
    <script>
      window.addEventListener('message', (event) => {
        console.log(event);

        if (event.data?.type === 'docbrowser-scroll-to-anchor') {
          document.getElementById(event.data.anchor)?.scrollIntoView();
          return;
        }

        if (event.data?.type === 'docbrowser-theme-vars') {
          for (const [name, value] of Object.entries(event.data.vars)) {
            document.documentElement.style.setProperty(name, value);
          }
        }
      });

      const ws = new WebSocket('ws://localhost:3001');
      ws.onmessage = (e) => {
        if (e.data === 'reload-css') {
          location.reload();
        }
      };

      window.parent.postMessage({ type: 'docbrowser-ready' }, '*');
    </script>`;
}
