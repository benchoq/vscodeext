// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as net from 'net';
import * as http from 'http';
import {
  Disposable,
  EventEmitter,
  ExtensionContext as Context,
 } from 'vscode';

import { createWrappedLogger } from 'qt-lib';
import { DocViewerHttpDispatcher } from './http-dispatcher';
const logger = createWrappedLogger('doc-viewer-server');

export class DocViewerHttpServer implements Disposable {
  private _http: http.Server | undefined;
  private readonly _dispatcher: DocViewerHttpDispatcher;
  private readonly _cssChangedEmitter = new EventEmitter<void>();

  constructor(private readonly _context: Context) {
    this._dispatcher = new DocViewerHttpDispatcher(this._context, () => {
      this._cssChangedEmitter.fire();
    });
  }

  dispose(): void {
    if (this._http) {
      this._http.close();
      logger.text("Server closing")
        .data('address', addrToString(this._http))
        .info();
    }
  }

  public get onCssChanged() {
    return this._cssChangedEmitter.event;
  }

  public readonly scheme = 'http';
  public readonly host = '127.0.0.1';

  public get port(): number | undefined {
    const addr = this._http?.address();
    return (typeof addr === 'object') ? addr?.port : undefined;
  }

  public get origin() {
    const port = this.port;
    return port ? `${this.scheme}://${this.host}:${String(port)}` : '';
  }

  async start(): Promise<void> {
    if (this._http) {
      logger.text("Server is already running")
        .data('address', addrToString(this._http))
        .debug();

      return;
    }

    this._http = http.createServer((req, res) => {
      this._dispatcher.dispatch(req, res);
    });

    this._http.on('connection', () => {
      logger.text("Server connection")
        .data('port', this.port)
        .info();
    })

     this._http.on('close', () => {
      logger.text("Server close")
        .data('port', this.port)
        .info();
    })

    return new Promise((resolve, reject) => {
      if (this._http) {
        const anyPort = 0;
        this._http.once('error', reject);
        this._http.listen(anyPort, this.host, () => {
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
}

// helpers
function addrToString(server: net.Server | undefined) {
  const addr = server?.address();
  if (typeof addr === 'string') {
    return addr;
  }

  return addr ? `${addr.address}:${String(addr.port)}` : '';
}
