// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider, env } from 'vscode';
import * as path from 'path';
import * as vsctm from 'vscode-textmate';
import * as oniguruma from 'vscode-oniguruma';

import { createMarkdownHover } from './utils';
import { HoverInfo } from './types';

let igrammar: vsctm.IGrammar | null;
let registry: vsctm.Registry | undefined;

export class QmlHoverProvider implements HoverProvider {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  async provideHover(doc: TextDocument, pos: Position) {
    const range = doc.getWordRangeAtPosition(pos);
    const info: HoverInfo = {
      word: doc.getText(range),
      line: doc.lineAt(pos.line).text,
      pos,
      range
    }

    const scopes = await doTm(doc, info) ?? [];
    console.log(scopes);

    if (scopes.includes('entity.name.type.object.qml')) {
      return createMarkdownHover({ keyword: info.word, appendix: 'QML Type' })
    }

    if (scopes.includes('storage.type.primitive.qml')) {
      return createMarkdownHover({ keyword: info.word, appendix: 'QML Value Type' })
    }

    if (scopes.includes('entity.name.namespace.qml') && scopes.includes('meta.import.qml')) {
      return createMarkdownHover({ keyword: info.word, appendix: 'QML Value Types' })
    }

    if (scopes.includes('meta.pragma.qml')) {
      if (scopes.includes('entity.other.attribute-name.pragma.qml') || scopes.includes('constant.language.pragma.qml')) {
        return createMarkdownHover({ keyword: 'structure of qml document', appendix: '' })
      }
    }

    // QML Types

    // for (const resolver of keywordResolvers) {
    //   const result = resolver(info);
    //   if (result) {
    //     return createMarkdownHover(result);
    //   }
    // }

    return undefined;
  }
}

import * as fs from 'fs';
import { fsFile } from '@/fs-utils';

function readFile(filePath: string) {
  return fsFile(filePath).readAll();
}

function setupRegistry() {
  const wasmPath = '/Users/bencho/ws_vscode/1118.editor-to-doc/vscodeext/qt-core/node_modules/vscode-oniguruma/release/onig.wasm';
  const wasmBin = fs.readFileSync(wasmPath).buffer;

  const onigLib = oniguruma.loadWASM(wasmBin).then(() => {
    return {
      createOnigScanner(patterns: string[]) {
        return new oniguruma.OnigScanner(patterns);
      },

      createOnigString(s: string) {
        return new oniguruma.OnigString(s);
      }
    };
  });

  const qmlGrammerPath = '/Users/bencho/ws_vscode/1118.editor-to-doc/vscodeext/qt-qml/res/lang/qml/qml.qmlproject.tmLanguage.json';
  const jsGrammarPath = path.join(
    env.appRoot,
    'extensions/javascript/syntaxes/JavaScript.tmLanguage.json'
  );

  return new vsctm.Registry({
    onigLib,
    loadGrammar: async (scopeName) => {
      if (scopeName === 'source.qml') {
        const bytes = readFile(qmlGrammerPath).toString();
        return Promise.resolve(vsctm.parseRawGrammar(bytes, qmlGrammerPath));
      }

      if (scopeName === 'source.js') {
        const text = fs.readFileSync(jsGrammarPath, 'utf8');
        return vsctm.parseRawGrammar(text, jsGrammarPath);
      }

      console.log(`Unknown scope name: ${scopeName}`);
      return Promise.resolve(null);
    }
  });
}

// Per-document cache of rule stacks. `states[i]` is the state at the start
// of line `i`. The whole entry is discarded when the document version changes.
interface RuleStackCache {
  version: number;
  states: vsctm.StateStack[];
}
const ruleStackCache = new Map<string, RuleStackCache>();

export function releaseRuleStackCache(doc: TextDocument) {
  ruleStackCache.delete(doc.uri.toString());
}

// Rules like `property` only match inside an object block (`Item { ... }`),
// so the rule stack must be built up from the start of the document.
function ruleStackAt(doc: TextDocument, line: number, grammar: vsctm.IGrammar) {
  const key = doc.uri.toString();
  let cache = ruleStackCache.get(key);
  if (!cache || cache.version !== doc.version) {
    cache = { version: doc.version, states: [vsctm.INITIAL] };
    ruleStackCache.set(key, cache);
  }

  const states = cache.states;
  for (let i = states.length - 1; i < line; ++i) {
    const prev = states[i] ?? vsctm.INITIAL;
    states.push(grammar.tokenizeLine(doc.lineAt(i).text, prev).ruleStack);
  }
  return states[line] ?? vsctm.INITIAL;
}

async function doTm(doc: TextDocument, info: HoverInfo) {
  if (!registry || !igrammar) {
    registry = setupRegistry();
    igrammar = await registry.loadGrammar('source.qml');
  }

  if (igrammar === null) {
    console.log('grammar is null');
    return;
  }

  let ruleStack = ruleStackAt(doc, info.pos.line, igrammar);

  const lines = [info.line];
  for (const line of lines) {
    const tokenized = igrammar.tokenizeLine(line, ruleStack);

    for (const token of tokenized.tokens) {
      if (token.scopes.length === 1) {
        continue;
      }

      const s = token.startIndex;
      const e = token.endIndex;
      // const subString = line.substring(s, e);

      // console.log(
      //   `[${String(s)}, ${String(e)}): ${subString}:`,
      //   token.scopes.join(', '),
      //   `(@ ${String(info.pos.character)})`
      // );

      if (s <= info.pos.character && info.pos.character < e) {
        // console.log(
        //   `[${String(s)}, ${String(e)}): ${subString}:`,
        //   token.scopes.join(', '),
        //   `(@ ${String(info.pos.character)})`
        // );

        return token.scopes;
      }
    }

    ruleStack = tokenized.ruleStack;
  }

  return [];
}

// helpers and local types
// function resolveImport(info: HoverInfo): ResolvedResult | undefined {
//   // import QtQuick
//   // import QtQuick.Layouts
//   // import QtQuick.Controls.Basic

//   const re = /^[ \t]*import[ \t]+(Qt[\w.]*)/;
//   const moduleName = re.exec(info.line)?.[1] ?? ''; // QtQuick.Layouts
//   const keyword = moduleName // Qt Quick Layouts
//       .replace(/([a-z])([A-Z])/g, '$1 $2')
//       .replace(/\./g, ' ');

//   return keyword && moduleName.includes(info.word) ? {
//     kind: 'qml-import',
//     keyword,
//     appendix: 'QML Types',
//     linkText: moduleName
//   } : undefined;
// }

// function resolveValueType(info: HoverInfo): ResolvedResult | undefined {
//   // property bool lightMode: Application.styleHints.colorScheme === Qt.Light
//   // property color reallyDark: "#1f1f1f"
//   // property color dark: "#262626"
//   // property color reallyLight: "#e7e7e7"
//   // property color light: "#e0e0e0"

//   const re = /^[ \t]*property[ \t]+([a-z]\w+)[ \t]/;
//   const keyword = re.exec(info.line)?.[1] ?? '';
//   return (keyword && keyword === info.word) ? {
//     kind: 'qml-value-type',
//     keyword: keyword,
//     appendix: 'QML Value Type'
//   } : undefined;
// }

// function resolveQmlType(info: HoverInfo): ResolvedResult | undefined {
//   // Rectangle
//   // ApplicationWindow
//   // Layout.fillWidth => "Layout"
//   // but, Qt.Light ==> 'Light' shouldn't match
//   const re = /\b[A-Z][a-z0-9_]*(?:[A-Z][a-z0-9_]*)*\b/;
//   const m = re.exec(info.word)?.[0] ?? '';
//   return m ? {
//     kind: 'qml-type',
//     keyword: m,
//     appendix: 'QML Type'
//   } : undefined;
// }

// const keywordResolvers: KeywordResolver[] = [
//   resolveImport,
//   resolveValueType,
//   resolveQmlType
// ]
