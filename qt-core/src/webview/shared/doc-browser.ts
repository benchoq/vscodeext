// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface HtmlPageInfo {
  title: string;
  filePathRel: string;
  anchor?: string;
}

export interface TocEntry {
  type: 'toc';
  page: HtmlPageInfo;
  depth: number;
}

export interface IndexMatch {
  type: 'index';
  page: HtmlPageInfo;
  name: string;
  identifier: string;
}

export interface FullTextMatch {
  type: 'full-text';
  page: HtmlPageInfo;
  snippet: string;
}

export enum ViewerActionId {
  ScrollToAnchor = 'docbrowser-scroll-to-anchor',
  ApplyVscodeTheme = 'docbrowser-apply-vscode-theme',
  NotifyViewerReady = 'docbrowser-notify-viewer-ready',
  DevReload = 'docbrowser-dev-reload'
}

export const DevViewerWebSocketPort = 3001
export const DevViewerWebSocketUri = `ws://localhost:${String(DevViewerWebSocketPort)}')`;

// type guard functions
export function isHtmlPageInfo(x: unknown): x is HtmlPageInfo {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    typeof o.title === 'string' &&
    typeof o.filePathRel === 'string' &&
    (o.anchor === undefined || typeof o.anchor === 'string')
  );
}

export function isTocEntry(x: unknown): x is TocEntry {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    o.type === 'toc' &&
    isHtmlPageInfo(o.page) &&
    typeof o.depth === 'number'
  );
}

export function isIndexMatch(x: unknown): x is IndexMatch {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    o.type === 'index' &&
    isHtmlPageInfo(o.page) &&
    typeof o.name === 'string' &&
    typeof o.identifier === 'string'
  );
}

export function isFullTextMatch(x: unknown): x is FullTextMatch {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    o.type === 'full-text' &&
    isHtmlPageInfo(o.page) &&
    typeof o.snippet === 'string'
  );
}
