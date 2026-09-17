// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as net from 'net';
import * as http from 'http';
import * as path from 'path';
import { WebSocketServer } from 'ws';
import { Disposable } from 'vscode';

import { createWrappedLogger } from 'qt-lib';
import {
  RequestHandler,
  RequestContext,
  CssOverrideHandler,
  ScriptInjectionHandler,
  FallbackHandler,
  sendForbidden
} from './local-server-handlers';
import { ViewerActionId, DevViewerWebSocketPort } from '../shared/doc-browser';

const logger = createWrappedLogger('docbrowser-localserver');
const cssPath = '/Users/bencho/ws_vscode/0907.doc-browser/vscodeext/qt-core/src/webview/doc-browser/doc-styles.css';

export class DocBrowserLocalServer implements Disposable {
  private _server: http.Server | undefined;
  private readonly _handlers: RequestHandler[] = [
    new CssOverrideHandler(cssPath),
    new ScriptInjectionHandler(),
    new FallbackHandler(),
  ];

  constructor(private readonly _contentRoot: string) {
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
        const wss = new WebSocketServer({ port: DevViewerWebSocketPort });
        chokidar.watch(cssPath).on('change', () => {
          console.log("css changed");

          wss.clients.forEach((c) => {
            c.send(ViewerActionId.DevReload);
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

    if (!this._isAccessAllowed(filePath)) {
      sendForbidden(res, filePath);
      return;
    }

    const c: RequestContext = {
      filePath,
      fileName,
      res
    };

    const handler = this._handlers.find((h) => h.canHandle(c));
    handler?.handle(c);
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
