// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface HoverInfo {
  word: string;
  line: string;
}

export interface ResolvedResult {
  kind: 'qml-import' | 'qml-type' | 'qml-value-type';
  keyword: string;
  appendix: string;
  linkText?: string;
}

export type KeywordResolver = (info: HoverInfo) => ResolvedResult | undefined ;
