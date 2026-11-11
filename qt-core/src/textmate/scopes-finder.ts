// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument } from 'vscode';

import { TmInfra } from './infra';

export class TmScopesFinder {
  constructor(
    private readonly _tm: TmInfra,
    private readonly _scopeName: string
  ) {}

  public async find(doc: TextDocument, pos: Position) {
    const g = await this._tm.registry.grammarOf(this._scopeName);
    if (!g) {
      console.log(`No TextMate grammar for ${this._scopeName}`);
      return undefined;
    }

    const startState = this._tm.cache.startStateOf(doc, pos.line, g);
    const line = doc.lineAt(pos.line).text;
    const tokens = g.tokenizeLine(line, startState).tokens;
    const col = pos.character;

    for (const token of tokens) {
      const hasOwnScope = token.scopes.length > 1;
      const covers = token.startIndex <= col && col < token.endIndex;

      if (hasOwnScope && covers) {
        return token.scopes;
      }
    }

    return undefined;
  }
}
