// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export type TriggerSource = 'ex-browser' | 'qt-help' | 'doc-viewer';

export interface OpenOptions {
  trigger?: TriggerSource;
  homeUrl?: string;
  syncPanelTitle?: boolean;
  forceNewWindow?: boolean;
}

export interface UiState {
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

export enum IframeMessageId {
  RequestFindInPage = 'request-find-in-page',
  RequestReloadPage = 'request-reload-page',
  RequestCopySelected = 'request-copy-selected',
  RequestApplyVscodeTheme = 'request-apply-vscode-theme',
  EventLoaded = 'event-loaded',
  EventClicked = 'event-clicked',
  EventKeyDown = 'event-key-down',
  EventMouseDown = 'event-mouse-down',
  EventContextMenu = 'event-contextmenu',
  EventHoverChanged = 'event-hover-changed',
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
