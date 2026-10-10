// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as net from 'net';
import * as http from 'http';
import {
  Uri,
  Disposable,
  EventEmitter,
  ExtensionContext as Context,
 } from 'vscode';

import { createWrappedLogger } from 'qt-lib';
import { DocViewerHttpWorker } from './worker';

const logger = createWrappedLogger('doc-viewer-server');

export class DocViewerHttpServer implements Disposable {
  private _http: http.Server | undefined;
  private readonly _worker: DocViewerHttpWorker;
  private readonly _cssChangedEmitter = new EventEmitter<void>();

  constructor(private readonly _context: Context) {
    this._worker = new DocViewerHttpWorker(this._context, () => {
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

  public get baseUri(): Uri {
    return Uri.from({
      scheme: this._scheme,
      authority: this._authority,
    });
  }

  public getRedirectUri(uri: Uri) {
    if (uri.scheme === 'file') {
      return uri.with({
        scheme: this._scheme,
        authority: this._authority
      })
    }

    return uri;
  }

  public isServableUri(uri: Uri){
    return (uri.scheme === this._scheme) && (uri.authority === this._authority);
  }

  async start(): Promise<void> {
    if (this._http) {
      logger.text("Server is already running")
        .data('address', addrToString(this._http))
        .debug();

      return;
    }

    this._http = http.createServer((req, res) => {
      this._worker.dispatch(req, res);
    });

    this._http.on('connection', () => {
      logger.text("Server connection")
        .data('port', this._port)
        .info();
    })

     this._http.on('close', () => {
      logger.text("Server close")
        .data('port', this._port)
        .info();
    })

    return new Promise((resolve, reject) => {
      if (this._http) {
        const anyPort = 0;
        this._http.once('error', reject);
        this._http.listen(anyPort, this._host, () => {
          logger.text("Server listening...")
            .data('port', this._port)
            .info();

          resolve();
        });

        return;
      }

      reject(new Error('Server instance is invalid'));
    });
  }

  private readonly _scheme = 'http';
  private readonly _host = '127.0.0.1';

  private get _authority() {
    const p = this._port;
    return p ? `${this._host}:${String(this._port)}` : '';
  }

  private get _port(): number | undefined {
    const addr = this._http?.address();
    return (typeof addr === 'object') ? addr?.port : undefined;
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
