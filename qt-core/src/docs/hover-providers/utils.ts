// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Hover, MarkdownString } from 'vscode';
import { type ScopeMatchResult } from './types';

export function createMarkdownHover(r: ScopeMatchResult): Hover {
  const prefix = '$(book) Qt help: ';
  const linkText = linkTextOf(r);
  const linkTarget = [
    'command:qt-core.openQtHelpFromEditor',
    encodeURIComponent(JSON.stringify(r))
  ].join('?');

  const link = `${prefix}[${linkText}](${linkTarget})`;

  const md = new MarkdownString(link);
  md.isTrusted = true;
  md.supportThemeIcons = true;

  return new Hover(md);
}

function linkTextOf(r: ScopeMatchResult) {
  const typeText = `${r.typeName} QML type`;
  if (!r.attributeName) {
    return typeText;
  }

  const memberText = `${r.typeName}.${r.attributeName}`;

  switch (r.kind) {
    case 'object':
      return typeText;
    case 'attribute':
      return memberText;
    case 'attached-prop':
      return `${memberText} (attached)`;
    case 'signal-handler':
      return `${memberText} signal`;
  }
}


// export interface ResolvedResult {
//   keyword: string;
//   appendix: string;
//   linkText?: string;
// }