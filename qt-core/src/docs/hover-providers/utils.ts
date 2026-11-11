// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Hover, MarkdownString } from 'vscode';
import { type ResolvedResult } from './types';

export function createMarkdownHover(r: ResolvedResult): Hover {
  const keyword = `${r.keyword} ${r.appendix}`;

  const prefix = '$(book) Open help: ';
  const linkText = r.linkText ?? r.keyword;
  const linkTarget = [
    'command:qt-core.openQtHelpFromEditor',
    encodeURIComponent(JSON.stringify(keyword))
  ].join('?');

  const link = `${prefix}[${linkText}](${linkTarget})`;

  const md = new MarkdownString(link);
  md.isTrusted = true;
  md.supportThemeIcons = true;

  return new Hover(md);
}
