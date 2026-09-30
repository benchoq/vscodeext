// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only


export interface QtDocRootInfo {
  source: 'insRoot' | 'qtpaths';
  version: string;
  fsPath: string;
}

export interface HtmlPageInfo {
  title: string;
  href: string;
  filePathRel?: string;
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
}

export interface FullTextMatch {
  type: 'full-text';
  page: HtmlPageInfo;
  snippet: string;
}

export enum ViewerMessageId {
  FindInPage = 'qt-browser-find-in-page',
  ReloadPage = 'qt-browser-reload-page',
  ApplyVscodeTheme = 'qt-browser-apply-vscode-theme',
  ViewerLoaded = 'qt-browser-loaded',
  ViewerClicked = 'qt-browser-viewer-clicked',
  ViewerHoverChanged = 'qt-browser-viewer-hover-changed',
}

export function isSameHtmlPage(a: HtmlPageInfo, b: HtmlPageInfo) {
  return (a.href === b.href);
}

// type guard functions
export function isQtDocRootInfo(x: unknown): x is QtDocRootInfo {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    (o.source === 'insRoot' || o.source === 'qtpaths') &&
    typeof o.version === 'string' &&
    typeof o.fsPath === 'string'
  );
}

export function isHtmlPageInfo(x: unknown): x is HtmlPageInfo {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    typeof o.href === 'string' &&
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
    typeof o.name === 'string'
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
