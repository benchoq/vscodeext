// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type HistoryEntry,
  type BookmarkEntry
} from "@shared/qt-browser";

export interface BookmarkViewEntry {
  data: BookmarkEntry;
  checked: boolean
}

export interface HistoryViewEntry {
  data: HistoryEntry;
  checked: boolean
}

export type FindAction = 'new' | 'prev' | 'next' | 'clear';

export class HistoryManager {
  private _history = $state([] as HistoryEntry[]);
  private _currentIndex = $state(-1);

  public go(dir: 'back' | 'forward') {
    if (dir === 'back') {
      if (this._currentIndex > 0) {
        this._currentIndex--;
        return this.currentEntry;
      }
    }

    if (dir === 'forward') {
      if (this._currentIndex + 1 < this._history.length) {
        this._currentIndex++;
        return this.currentEntry;
      }
    }

    return undefined;
  }

  public canGo(dir: 'back' | 'forward') {
    if (dir === 'back') {
      return this._currentIndex > 0;
    }

    return this._currentIndex + 1 < this._history.length;
  }

  public get currentEntry() {
    return this._history[this._currentIndex];
  }

  public push(entry: HistoryEntry) {
    if ((entry.uri.length === 0)
      || (this.currentEntry && (entry.uri, this.currentEntry.uri))) {
      return;
    }

    this._history = [
      ...this._history.slice(0, this._currentIndex + 1),
      entry
    ];

    this._currentIndex = this._history.length - 1;
  }

  public pushUrl(url: URL) {
    this.push({
      uri: url.href,
      title: '',
    });
  }
}
