// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

// import * as vscode from 'vscode';

import { DocBrowserLocalServer } from './local-server';

export class DocBrowserLocalServerManager {
  private readonly _servers = new Map<string, DocBrowserLocalServer>();

  public dispose() {
    this._servers.forEach((v) => {
      v.dispose();
    });

    this._servers.clear();
  }

  public get(rootDir: string) {
    return this._servers.get(rootDir);
  }

  public async prepare(rootDir: string) {
    if (!this._servers.has(rootDir)) {
      this._servers.set(rootDir, new DocBrowserLocalServer(rootDir));
    }

    const s = this._servers.get(rootDir);
    await s?.start();
  }

  public find(key: string): DocBrowserLocalServer | undefined {
    return this._servers.get(key);
  }
}
