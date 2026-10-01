// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from "vscode";
import { BookmarkEntry } from "@/webview/shared/qt-browser";

const STORAGE_KEY = "qtBrowser.bookmarks";

export class QtBrowserBookmarkManager {
  private _entries: BookmarkEntry[] = [];

  constructor(private readonly _memento: vscode.Memento) {
    this.load();
  }

  public get entries() {
    return this._entries;
  }

  public contains(uri: string) {
    return this._findIndex(uri) !== -1;
  }

  public runAction(action: string, selection: BookmarkEntry[], from: number, to: number) {
    switch (action) {
      case 'remove-all':
        this._entries = [];
        return true;

      case 'remove-selected': {
        const uris = new Set(selection.map((e) => e.uri));
        this._entries = this._entries.filter((e) => !uris.has(e.uri));
        return true;
      }

      case 'move': {
        const [item] = this._entries.splice(from, 1);
        if (item) {
          this._entries.splice(to, 0, item);
          return true;
        }
        break;
      }

      default:
        break;
    }

    return false;
  }

  public update(uri: string, title: string, action: string) {
    const index = this._findIndex(uri);
    const exists = index !== -1;

    if (action === 'toggle') {
      action = exists ? 'remove' : 'add';
    }

    if (action === 'add' && !exists) {
      this._entries.push({ uri, title });
      void this.save();
      return true;
    }

    if (action === 'remove' && exists) {
      this._entries.splice(index, 1);
      void this.save();
      return true;
    }

    return false;
  }

  public load() {
    this._entries = [...this._memento.get<BookmarkEntry[]>(STORAGE_KEY, [])];
  }

  public save() {
    return this._memento.update(STORAGE_KEY, this._entries);
  }

  private _findIndex(uri: string) {
    return this._entries.findIndex((e) => e.uri === uri);
  }
}
