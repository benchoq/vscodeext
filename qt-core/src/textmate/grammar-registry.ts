// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';
import * as tm from 'vscode-textmate';
import * as oniguruma from 'vscode-oniguruma';
import { extensions } from 'vscode';

import { fsFile } from '@/fs-utils';

// Loads the grammars that extensions contribute, by scope name, with one
// vscode-textmate registry and one oniguruma instance shared by all users
export class TmGrammarRegistry {
  private _registry: tm.Registry | undefined;
  private readonly _grammars = new Map<string, Promise<tm.IGrammar | null>>();

  constructor(private readonly _extensionPath: string) {}

  public async grammarOf(scopeName: string) {
    let grammar = this._grammars.get(scopeName);
    if (!grammar) {
      this._registry ??= createTmRegistry(this._extensionPath);
      grammar = this._registry.loadGrammar(scopeName);
      this._grammars.set(scopeName, grammar);
    }

    try {
      return (await grammar) ?? undefined;
    } catch (e) {
      this._grammars.delete(scopeName);
      throw e;
    }
  }
}

// helpers, internal types
interface GrammarContribution {
  scopeName: string;
  absPath: string;
  injectTo: string[];
}

interface RawGrammarContribution {
  scopeName?: string;
  path?: string;
  injectTo?: string[];
}

function createTmRegistry(extensionPath: string) {
  return new tm.Registry({
    onigLib: createOnigLib(extensionPath),

    loadGrammar: async (scopeName) => {
      const absPath = findGrammarContributions().find(
        (g) => g.scopeName === scopeName
      )?.absPath;

      if (absPath) {
        return tm.parseRawGrammar(
          fsFile(absPath).readAll().toString(),
          absPath
        );
      }

      console.log(`Unknown scope name: ${scopeName}`);
      return Promise.resolve(null);
    },

    // e.g. scopes in QML JavaScript, as `qsTr()`, come from the
    // `qml-js.injection` grammar of qt-qml
    getInjections: (scopeName) => {
      return findGrammarContributions()
        .filter((g) => g.injectTo.includes(scopeName))
        .map((g) => g.scopeName);
    }
  });
}

async function createOnigLib(extensionPath: string) {
  const wasmPath = path.join(extensionPath, 'res', 'others', 'onig.wasm');
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

// The grammars that extensions contribute, as VS Code finds them, e.g.
// `source.qml` and its injection grammar from qt-qml, `source.js` from the
// built-in JavaScript extension
function findGrammarContributions(): GrammarContribution[] {
  const all: GrammarContribution[] = [];

  for (const ext of extensions.all) {
    const packageJson = ext.packageJSON as {
      contributes?: { grammars?: RawGrammarContribution[] };
    };

    for (const g of packageJson.contributes?.grammars ?? []) {
      if (g.scopeName && g.path) {
        all.push({
          scopeName: g.scopeName,
          absPath: path.join(ext.extensionPath, g.path),
          injectTo: g.injectTo ?? []
        });
      }
    }
  }

  return all;
}
