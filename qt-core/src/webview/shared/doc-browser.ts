// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface HtmlEntry {
  title: string;
  filePathRel: string;
  anchor?: string;
}

export interface IndexData extends HtmlEntry {
  name: string;
  identifier: string;
}

export interface TocEntry extends HtmlEntry {
  depth: number;
}

export interface FullTextSearchData extends HtmlEntry {
  snippet: string;
}

// type guard functions
export function isHtmlEntry(x: unknown): x is HtmlEntry {
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

export function isIndexData(x: unknown): x is IndexData {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const o = x as Record<string, unknown>;
  return (
    isHtmlEntry(x) &&
    typeof o.name === 'string' &&
    typeof o.anchor === 'string' &&
    typeof o.identifier === 'string'
  );
}

export function isTocEntry(x: unknown): x is TocEntry {
  if (!isHtmlEntry(x)) {
    return false;
  }

  return (
    'depth' in x && typeof x.depth === 'number'
  );
}

export function isFullTextSearchData(x: unknown): x is FullTextSearchData {
  if (!isHtmlEntry(x)) {
    return false;
  }

  return (
    'snippet' in x && typeof x.snippet === 'string'
  );
}
