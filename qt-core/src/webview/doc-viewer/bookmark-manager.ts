// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from "vscode";

import { BookmarkEdit, BookmarkEntry } from "@/webview/shared/doc-viewer";
import * as consts from './constants';

export class DocViewerBookmarkManager {
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

  public edit(edit: BookmarkEdit) {
    switch (edit.action) {
      case 'toggle': {
        if (edit.entry.uri.length === 0) {
          break;
        }

        const index = this._findIndex(edit.entry.uri);
        if (index === -1) {
          this._entries.push(edit.entry);
        } else {
          this._entries.splice(index, 1);
        }

        return true;
      }

      case 'move': {
        const [item] = this._entries.splice(edit.from, 1);
        if (item) {
          this._entries.splice(edit.to, 0, item);
          return true;
        }
        break;
      }

      case 'remove': {
        const uris = new Set(edit.selection.map((e) => e.uri));
        this._entries = this._entries.filter((e) => !uris.has(e.uri));
        return true;
      }

      case 'clear':
        this._entries = [];
        return true;

      default:
        break;
    }

    return false;
  }

  public load() {
    this._entries = [...this._memento.get<BookmarkEntry[]>(
      consts.BookmarkStorageKey, []
    )];
  }

  public save() {
    return this._memento.update(
      consts.BookmarkStorageKey, this._entries);
  }

  private _findIndex(uri: string) {
    return this._entries.findIndex((e) => e.uri === uri);
  }
}
