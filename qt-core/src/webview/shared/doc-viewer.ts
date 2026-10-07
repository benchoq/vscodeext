// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export type QtBrowserTriggerSource = 'ex-browser' | 'qt-help' | 'doc-viewer';

export interface QtBrowserOpenOptions {
  homeUrl?: string;
  trigger?: QtBrowserTriggerSource;
  syncPanelTitle?: boolean;
  forceNewWindow?: boolean;
}

export interface QtBrowserViewerState {
  uri?: string;
  title?: string;
}

export interface BookmarkEntry {
  uri: string;
  title: string;
}

export type BookmarkEdit =
  | { action: 'toggle'; entry: BookmarkEntry }
  | { action: 'remove'; selection: BookmarkEntry[] }
  | { action: 'move'; from: number; to: number }
  | { action: 'clear' };

export interface HistoryEntry {
  uri: string;
  title: string;
  timestamp?: number;
}

export type HistoryEdit =
  | { action: 'add'; entry: HistoryEntry }
  | { action: 'remove'; selection: HistoryEntry[] }
  | { action: 'clear' };

export enum ViewerMessageId {
  FindInPage = 'doc-viewer-find-in-page',
  ReloadPage = 'doc-viewer-reload-page',
  CopySelection = 'doc-viewer-copy-selection',
  ApplyVscodeTheme = 'doc-viewer-apply-vscode-theme',
  ViewerLoaded = 'doc-viewer-loaded',
  ViewerClicked = 'doc-viewer-viewer-clicked',
  ViewerKeyDown = 'doc-viewer-viewer-key-down',
  ViewerMouseDown = 'doc-viewer-viewer-mouse-down',
  ViewerContextMenu = 'doc-viewer-viewer-contextmenu',
  ViewerHoverChanged = 'doc-viewer-viewer-hover-changed',
}

// type guard functions
export function isBookmarkEntry(x: unknown): x is BookmarkEntry {
  if (!isValidObject(x)) {
    return false;
  }

  return (
    typeof x.uri === 'string' &&
    typeof x.title === 'string'
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

export function isHistoryEntry(x: unknown): x is HistoryEntry {
  if (!isValidObject(x)) {
    return false;
  }

  return (
    typeof x.uri === 'string' &&
    typeof x.title === 'string' &&
    (x.timestamp === undefined || typeof x.timestamp === 'number')
  );
}

export function isHistoryEdit(x: unknown): x is HistoryEdit {
  if (typeof x !== 'object' || x === null || !('action' in x)) {
    return false;
  }

  const e = x as Record<string, unknown>;
  switch (e.action) {
    case 'add':
      return isHistoryEntry(e.entry);

    case 'remove':
      return Array.isArray(e.selection) && e.selection.every(isHistoryEntry);

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

// function isStringArray(x: unknown): x is string[] {
//   return Array.isArray(x) && x.every((e) => typeof e === 'string');
// }
