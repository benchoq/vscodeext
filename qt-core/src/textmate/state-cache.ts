// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as tm from 'vscode-textmate';
import { TextDocument } from 'vscode';

// The tokenizer state at the start of each line, per document version and
// grammar, so that a line can be tokenized without the lines before it
export class TmLineStartStateCache {
  private readonly _cache = new Map<string, TmDocLineStartStates>();

  public release(doc: TextDocument) {
    this._cache.delete(doc.uri.toString());
  }

  public startStateOf(doc: TextDocument, line: number, grammar: tm.IGrammar) {
    const key = doc.uri.toString();
    let states = this._cache.get(key);
    if (!states || states.isOutdated(grammar)) {
      states = new TmDocLineStartStates(doc, grammar);
      this._cache.set(key, states);
    }

    states.fillUpTo(line);
    return states.startStateOf(line);
  }
}

// internal types and helpers
class TmDocLineStartStates {
  private readonly _version: number;
  private readonly _startStates: tm.StateStack[] = [tm.INITIAL];

  constructor(
    private readonly _doc: TextDocument,
    private readonly _grammar: tm.IGrammar
  ) {
    this._version = this._doc.version;
  }

  public isOutdated(grammar: tm.IGrammar) {
    return this._version !== this._doc.version || this._grammar !== grammar;
  }

  public startStateOf(line: number) {
    return this._startStates[line] ?? tm.INITIAL;
  }

  public fillUpTo(line: number) {
    for (let i = this._startStates.length - 1; i < line; ++i) {
      const prevState = this._startStates[i] ?? tm.INITIAL;
      const currentText = this._doc.lineAt(i).text;

      const tokenized = this._grammar.tokenizeLine(currentText, prevState);
      this._startStates.push(tokenized.ruleStack);
    }
  }
}
