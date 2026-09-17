// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type TocEntry,
  type HtmlPageInfo,
} from "@shared/doc-browser";

export interface TocTreeNode {
  id: number;
  data: TocEntry;
  children: TocTreeNode[];
}

export class TocTreeModel {
  private _topLevels = $state([] as TocTreeNode[]);
  private _expandedIds = $state(new Set<number>);

  get topLevels() {
    return this._topLevels;
  }

  public expanded(id: number) {
    return this._expandedIds.has(id);
  }

  public toggleExpanded(id: number) {
    this.setExpanded(id, !this.expanded(id));
  }

  public setExpanded(id: number, expand: boolean) {
    if (this._expandedIds.has(id) === expand) {
      return;
    }

    const newSet = new Set(this._expandedIds);
    if (expand) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }

    this._expandedIds = newSet;
  }

  public rebuild(flatEntries: TocEntry[]) {
    this._topLevels = build(flatEntries);
    this._expandedIds = new Set<number>();
  }
}

export class HistoryManager {
  private _history = $state([] as HtmlPageInfo[]);
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

  public push(entry: HtmlPageInfo) {
    this._history = [
      ...this._history.slice(0, this._currentIndex + 1),
      entry
    ];
    this._currentIndex = this._history.length - 1;
  }
}

// helpers
function build(flatEntries: TocEntry[]): TocTreeNode[] {
  const topLevels: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  flatEntries.forEach((entry, i) => {
    const node: TocTreeNode = {
      id: i,
      data: entry,
      children: []
    };

    if (entry.depth === 0 || !stack[entry.depth - 1]) {
      topLevels.push(node);
    } else {
      stack[entry.depth - 1].children.push(node);
    }

    stack[entry.depth] = node;
    stack.length = entry.depth + 1;
  });

  return topLevels;
}
