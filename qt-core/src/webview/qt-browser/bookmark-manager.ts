// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export class QtBrowserBookmarkManager {
  private readonly _uris: string[] = [];

  public get uris() {
    return this._uris;
  }

  public contains(uri: string) {
    return this._uris.includes(uri);
  }

  public update(uri: string, action: string) {
    const index = this._uris.indexOf(uri);
    const exists = index !== -1;

    if (action === 'toggle') {
      action = exists ? 'remove' : 'add';
    }

    if (action === 'add' && !exists) {
      this._uris.push(uri);
      return true;
    }

    if (action === 'remove' && exists) {
      this._uris.splice(index, 1);
      return true;
    }

    return false;
  }
}
