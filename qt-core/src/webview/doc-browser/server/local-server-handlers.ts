// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { createWrappedLogger } from 'qt-lib';

import { ViewerMessageId } from '@/webview/shared/doc-browser';

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

export function getScriptToInject() {
  return /*html*/ `
    <script>
      function findInPage(keyword, dir) {
        return window.find(
          keyword,
          false, // caseSensitive
          (dir === 'backward') ? true : false,
          true, // wrapAround
          false, // wholeWord
          false, // searchInFrames
          false, // showDialog
        );
      }

      window.addEventListener('message', (e) => {
        if (e.data?.type === '${ViewerMessageId.LoadPage}') {
          location.replace(e.data.href);
          return;
        }

        if (e.data?.type === '${ViewerMessageId.ReloadPage}') {
          location.reload();
          return;
        }

        if (e.data?.type === '${ViewerMessageId.ScrollToAnchor}') {
          document.getElementById(e.data.anchor)?.scrollIntoView();
          return;
        }

        if (e.data?.type === '${ViewerMessageId.ApplyVscodeTheme}') {
          for (const [name, value] of Object.entries(e.data.vars)) {
            document.documentElement.style.setProperty(name, value);
          }
          return;
        }

        if (e.data?.type === '${ViewerMessageId.FindInPage}') {
          const keyword = e.data.keyword;
          const action = e.data.action;

          switch (action) {
            case 'new':
              window.getSelection()?.removeAllRanges();
              findInPage(e.data.keyword, 'forward');
              break;

            case 'prev':
              findInPage(e.data.keyword, 'backward');
              break;

            case 'next':
              findInPage(e.data.keyword, 'forward');
              break;

            case 'clear':
              window.getSelection()?.removeAllRanges();
              break;
          }
          return;
        }
      });

      window.addEventListener('load', (e) => {
        window.parent.postMessage(
          {
            type: '${ViewerMessageId.Loaded }',
            href: location.href,
            hash: location.hash,
            pathname: location.pathname
          },
          '*'
        );
      });
    </script>`;
}
