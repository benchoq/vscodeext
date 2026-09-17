// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { createWrappedLogger } from 'qt-lib';

import {
  ViewerActionId
} from '@/webview/shared/doc-browser';

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

export class CssOverrideHandler implements RequestHandler {
  private _css = '';

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  canHandle(c: RequestContext): boolean {
    return c.fileName.startsWith('offline') && c.fileName.endsWith('.css');
  }

  handle(c: RequestContext): void {
    c.res.writeHead(200, { 'Content-Type': 'text/css' });
    c.res.end(this._css);
  }

  public setCss(css: string) {
    this._css = css;
  }
}

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

function getScriptToInject() {
  return /*html*/ `
    <script>
      window.addEventListener('message', (e) => {
        if (e.data?.type === '${ViewerActionId.ScrollToAnchor}') {
          document.getElementById(e.data.anchor)?.scrollIntoView();
          return;
        }

        if (e.data?.type === '${ViewerActionId.ApplyVscodeTheme}') {
          for (const [name, value] of Object.entries(e.data.vars)) {
            document.documentElement.style.setProperty(name, value);
          }
          return;
        }

        if (e.data?.type === '${ViewerActionId.DevReloadPage}') {
          location.reload();
          return;
        }
      });

      window.parent.postMessage(
        { type: '${ViewerActionId.NotifyViewerReady }' },
        '*'
      );
    </script>`;
}
