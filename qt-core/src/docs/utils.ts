// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Hover, MarkdownString } from 'vscode';

export interface MarkdownLinkInfo {
  command: string;
  arg: unknown;
  label: string;
  prefix?: string;
}

export function createMarkdownHover(c: MarkdownLinkInfo) {
  const target = [
    `command:${c.command}`,
    encodeURIComponent(JSON.stringify(c.arg))
  ].join('?');

  const mdText = `${c.prefix ?? ''} [${c.label}](${target})`.trim();
  const md = new MarkdownString(mdText);
  md.isTrusted = true;
  md.supportThemeIcons = true;

  return new Hover(md);
}
