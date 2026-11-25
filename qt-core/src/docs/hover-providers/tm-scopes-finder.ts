// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as tm from 'vscode-textmate';
import * as path from 'path';
import * as oniguruma from 'vscode-oniguruma';
import { TextDocument, env } from 'vscode';

import { fsFile } from '@/fs-utils';
import { HoverInfo } from './types';
import { TmLineStartStateCache } from './tm-state-cache';

const tmRegistry = createTmRegistry();
;
export class QmlTmScopesFinder {
  private _grammarPromise: Promise<tm.IGrammar | null> | undefined;

  constructor(private readonly _cache: TmLineStartStateCache) {}

  public async scopesAt(doc: TextDocument, info: HoverInfo) {
    const g = await this._getGrammar();
    if (!g) {
      console.log('Invalid text mate grammar instance');
      return undefined;
    }

    const startState = this._cache.startStateOf(doc, info.pos.line, g);
    const tokens = g.tokenizeLine(info.line, startState).tokens;
    const col = info.pos.character;

    for (const token of tokens) {
      const hasOwnScope = token.scopes.length > 1;
      const covers = token.startIndex <= col && col < token.endIndex;

      if (hasOwnScope && covers) {
        return token.scopes;
      }
    }

    return undefined;
  }

  private async _getGrammar() {
    if (!this._grammarPromise) {
      this._grammarPromise = tmRegistry.loadGrammar('source.qml');
    }

    try {
      return await this._grammarPromise;
    } catch (e) {
      this._grammarPromise = undefined;
      throw e;
    }
  }
}

// helpers
function createTmRegistry() {
  return new tm.Registry({
    onigLib: createOnigLib(),
    loadGrammar: async (scopeName) => {
      const absPath = findGrammarFile(scopeName);
      if (absPath) {
        return tm.parseRawGrammar(
          fsFile(absPath).readAll().toString(),
          absPath
        );
      }

      console.log(`Unknown scope name: ${scopeName}`);
      return Promise.resolve(null);
    }
  });
}

async function createOnigLib() {
  const wasmPath = '/Users/bencho/ws_vscode/1118.editor-to-doc/vscodeext/qt-core/node_modules/vscode-oniguruma/release/onig.wasm';
  const wasmBin = fsFile(wasmPath).readAll();
  return oniguruma.loadWASM(wasmBin).then(() => {
    return {
      createOnigScanner(patterns: string[]) {
        return new oniguruma.OnigScanner(patterns);
      },

      createOnigString(s: string) {
        return new oniguruma.OnigString(s);
      }
    };
  });
}

function findGrammarFile(scopeName: string) {
  if (scopeName === 'source.qml') {
    return '/Users/bencho/ws_vscode/1118.editor-to-doc/vscodeext/qt-qml/res/lang/qml/qml.qmlproject.tmLanguage.json';
  }

  if (scopeName === 'source.js') {
    return path.join(
      env.appRoot,
      'extensions/javascript/syntaxes/JavaScript.tmLanguage.json'
    );
  }

  return undefined;
}
