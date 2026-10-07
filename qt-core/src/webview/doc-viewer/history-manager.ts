// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from "vscode";

import { HistoryEdit, HistoryEntry } from "@/webview/shared/doc-viewer";
import * as consts from './constants';

export class QtBrowserHistoryManager {
  private _entries: HistoryEntry[] = [];

  constructor(private readonly _memento: vscode.Memento) {
    this.load();
  }

  public get entries() {
    return this._entries;
  }

  public contains(uri: string) {
    return this._findIndex(uri) !== -1;
  }

  public edit(edit: HistoryEdit) {
    switch (edit.action) {
      case 'add': {
        const last = this._entries[this._entries.length - 1];
        const timestamp = Date.now();
        if (last?.uri === edit.entry.uri) {
          last.timestamp = timestamp;
        } else {
          this._entries.push({ ...edit.entry, timestamp });
        }

        return true;
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
    this._entries = [...this._memento.get<HistoryEntry[]>(
      consts.HistoryStorageKey, []
    )];
  }

  public save() {
    return this._memento.update(
      consts.HistoryStorageKey, this._entries);
  }

  private _findIndex(uri: string) {
    return this._entries.findIndex((e) => e.uri === uri);
  }
}
