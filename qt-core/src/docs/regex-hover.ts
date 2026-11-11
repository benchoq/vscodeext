
// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider } from 'vscode';

import { createMarkdownHover } from './utils';

export class QtRegexHoverProvider implements HoverProvider {
  constructor(private readonly _pattern: RegExp) {}

  provideHover(doc: TextDocument, pos: Position) {
    const range = doc.getWordRangeAtPosition(pos, this._pattern);
    if (!range) {
      return undefined;
    }

    const text = doc.getText(range);
    return createMarkdownHover({
      command: 'qt-core.documentationSearchForCurrentWord',
      arg: [text],
      label: text,
      prefix: '$(book)'
    });
  }
}
