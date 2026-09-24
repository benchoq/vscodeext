// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as net from 'net';
import * as http from 'http';
import * as path from 'path';
import { Disposable } from 'vscode';

import { createWrappedLogger } from 'qt-lib';
import {
  RequestHandler,
  RequestContext,
  CssOverrideHandler,
  ScriptInjectionHandler,
  FallbackHandler,
  sendForbidden,
  getScriptToInject
} from './local-server-handlers';

const logger = createWrappedLogger('docbrowser-localserver');

export class DocBrowserLocalServer implements Disposable {
  private _server: http.Server | undefined;
  private readonly _cssOverrideHandler = new CssOverrideHandler()
  private readonly _handlers: RequestHandler[] = []

  constructor(private readonly _contentRoot: string) {
    this._handlers.push(
      this._cssOverrideHandler,
      new ScriptInjectionHandler(),
      new FallbackHandler()
    );
  }

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

  public setCssOverride(css: string) {
    this._cssOverrideHandler.setCss(css);
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

    this._server.on('connection', () => {
      logger.text("Server connection")
        .data('port', this.port)
        .info();

      console.log('server: on-connection', performance.now().toFixed(2));
    })

     this._server.on('close', () => {
      logger.text("Server close")
        .data('port', this.port)
        .info();

      console.log('server: on-close', performance.now().toFixed(2));
    })

    return new Promise((resolve, reject) => {
      if (this._server) {
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
    const start = performance.now();
    console.log(`request took 0 ${req.url ?? '-'}`, performance.now().toFixed(2));

    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '');
    const filePath = path.join(this._contentRoot, urlPath);
    const fileName = path.basename(filePath);

    console.log(`request took 1 ${(performance.now() - start).toFixed(2)}ms`);

    if (req.url === '/') {
      const html = /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ${getScriptToInject()}
          </head>
          <body>
          </body>
        </html>
      `;
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (!this._isAccessAllowed(filePath)) {
      sendForbidden(res, filePath);
      return;
    }

    const c: RequestContext = {
      filePath,
      fileName,
      res
    };

    console.log(`request took 2 ${(performance.now() - start).toFixed(2)}ms`);
    const handler = this._handlers.find((h) => h.canHandle(c));
    handler?.handle(c);

    console.log(`request took 3 ${(performance.now() - start).toFixed(2)}ms`);
  }

  private _isAccessAllowed(filePath: string): boolean {
    return filePath.startsWith(this._contentRoot);
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
