// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as net from 'net';
import * as http from 'http';
import * as path from 'path';
import { WebSocketServer } from 'ws';
import {
  Disposable
} from 'vscode';

import { createWrappedLogger } from 'qt-lib';

const logger = createWrappedLogger('docbrowser-localserver');
const cssPath = '/Users/bencho/ws_vscode/0907.doc-browser/vscodeext/qt-core/src/webview/doc-browser/doc-styles.css';

export class DocBrowserLocalServer implements Disposable {
  private _server: http.Server | undefined;
  private readonly _contentRoot = '/Users/bencho/tools/Qt/Docs/Qt-6.11.1';

  dispose(): void {
    if (this._server) {
      this._server.close();
      logger.text("Server closing")
        .data('address', addrToString(this._server))
        .info();
    }
  }

  public readonly scheme = 'http';
  public readonly host = '127.0.0.1';

  public get port(): number | undefined {
    const addr = this._server?.address();
    return (typeof addr === 'object') ? addr?.port : undefined;
  }

  public get origin() {
    const port = this.port;
    return port ? `${this.scheme}://${this.host}:${String(port)}` : '';
  }

  async start(): Promise<void> {
    if (this._server) {
      logger.text("Server is already running")
        .data('address', addrToString(this._server))
        .debug();

      return;
    }

    this._server = http.createServer((req, res) => {
      this._onRequest(req, res);
    });

    const chokidar = await import('chokidar');

    return new Promise((resolve, reject) => {
      if (this._server) {
        const wss = new WebSocketServer({ port: 3001 });
        chokidar.watch(cssPath).on('change', () => {
          console.log("css changed");

          wss.clients.forEach((c) => {
            c.send('reload-css');
          });
        });

        const anyPort = 0;
        this._server.once('error', reject);
        this._server.listen(anyPort, this.host, () => {
          logger.text("Server listening...")
            .data('port', this.port)
            .info();

          resolve();
        });

        return;
      }

      reject(new Error('Server instance is invalid'));
    });
  }

  private _onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '');
    const filePath = path.join(this._contentRoot, urlPath);
    const fileName = path.basename(filePath);

    if (!filePath.startsWith(this._contentRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      logger.text('Forbidden').data({ filePath }).error();
      return;
    }

    if (fileName.startsWith('offline') && fileName.endsWith('.css')) {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(fs.readFileSync(cssPath));
      return;
    }

    fs.readFile(filePath, (err, data) => {
      logger.text('Reading file').data({ filePath }).debug();

      if (err) {
        res.writeHead(404);
        res.end('Not found');
        logger.text('Not found').data({ filePath }).error();
        return;
      }

      if (fileName.endsWith('.html')) {
        const html = String(data);
        const html2 = html.replace(
          '</body>',
          `${getScriptToInject()}</body>`
        );
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(html2);
        return;
      }

      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      res.end(data);
    });
  }
}

//helpers
function addrToString(server: net.Server | undefined) {
  if (!server) {
    return '';
  }

  const addr = server.address();
  if (typeof addr === 'string') {
    return addr;
  }

  if (addr) {
    return `${addr.address}:${String(addr.port)}`;
  }

  return '';
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
