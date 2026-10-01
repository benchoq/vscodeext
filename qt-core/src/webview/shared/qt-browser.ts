// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface HistoryEntry {
  uri: string;
  title: string;
}

export interface BookmarkEntry {
  uri: string;
  title: string;
}

export interface BookmarkLabel {
  id: string;
  name: string;
}

export type BookmarkEdit =
  | { action: 'toggle'; entry: BookmarkEntry }
  | { action: 'remove'; selection: BookmarkEntry[] }
  | { action: 'move'; from: number; to: number }
  | { action: 'clear' };

export enum ViewerMessageId {
  FindInPage = 'qt-browser-find-in-page',
  ReloadPage = 'qt-browser-reload-page',
  CopySelection = 'qt-browser-copy-selection',
  ApplyVscodeTheme = 'qt-browser-apply-vscode-theme',
  ViewerLoaded = 'qt-browser-loaded',
  ViewerClicked = 'qt-browser-viewer-clicked',
  ViewerKeyDown = 'qt-browser-viewer-key-down',
  ViewerMouseDown = 'qt-browser-viewer-mouse-down',
  ViewerContextMenu = 'qt-browser-viewer-contextmenu',
  ViewerHoverChanged = 'qt-browser-viewer-hover-changed',
}

// type guard functions
export function isHistoryEntry(x: unknown): x is HistoryEntry {
  if (!isValidObject(x)) {
    return false;
  }

  return (
    typeof x.uri === 'string' &&
    typeof x.title === 'string'
  );
}

export function isBookmarkEntry(x: unknown): x is BookmarkEntry {
  if (!isValidObject(x)) {
    return false;
  }

  return (
    typeof x.uri === 'string' &&
    typeof x.title === 'string'
  );
}

export function isBookmarkLabel(x: unknown): x is BookmarkLabel {
  if (!isValidObject(x)) {
    return false;
  }

  return (
    typeof x.id === 'string' &&
    typeof x.name === 'string'
  );
}

  export function isBookmarkEdit(x: unknown): x is BookmarkEdit {
  if (typeof x !== 'object' || x === null || !('action' in x)) {
    return false;
  }

  const e = x as Record<string, unknown>;
  switch (e.action) {
    case 'toggle':
      return isBookmarkEntry(e.entry);

    case 'move':
      return isIndex(e.from) && isIndex(e.to);

    case 'remove':
      return Array.isArray(e.selection) && e.selection.every(isBookmarkEntry);

    case 'clear':
      return true;

    default:
      return false;
  }
}


function isValidObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isIndex(v: unknown) {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0;
}

