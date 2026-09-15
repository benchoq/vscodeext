// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type TocEntry } from "@shared/doc-browser";

export interface TocTreeNode {
  id: number;
  data: TocEntry;
  children: TocTreeNode[];
}

export class TocTreeModel {
   private readonly _root = $state<TocTreeNode>({
    id: -1,
    data: {
      depth: -1,
      href: '',
      title: '(root)',
      folderName: ''
    },
    children: []
  });

  private _expandedIds = $state(new Set<number>);

  get topLevels() {
    return this._root.children;
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
    this._root.children = build(flatEntries);
    this._expandedIds = new Set<number>();
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
