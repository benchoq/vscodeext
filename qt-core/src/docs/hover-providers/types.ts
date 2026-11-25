// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, Range } from "vscode";

export interface HoverInfo {
  word: string;
  line: string;
  pos: Position;
  range?: Range | undefined;
}

export interface ResolvedResult {
  keyword: string;
  appendix: string;
  linkText?: string;
}

export type KeywordResolver = (info: HoverInfo) => ResolvedResult | undefined ;

export interface ScopeMatchResult {
  kind: 'object' | 'attribute' | 'attached-prop' | 'signal-handler';
  typeName: string;
  attributeName?: string;
}

export function isScopeMatchResult(x: unknown): x is ScopeMatchResult {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const r = x as Record<string, unknown>;
  return typeof r.kind === 'string' && typeof r.typeName === 'string';
}
