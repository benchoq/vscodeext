// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider } from 'vscode';

import { HoverInfo } from './types';
import { createMarkdownHover } from './utils';
import { TmLineStartStateCache } from './tm-state-cache';
import { QmlTmScopesFinder } from './tm-scopes-finder';

export const lineStartStates = new TmLineStartStateCache();
const scopesFinder = new QmlTmScopesFinder(lineStartStates);

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

    const scopes = await scopesFinder.scopesAt(doc, info) ?? [];
    console.log('textmate:', scopes);

    if (scopes.includes('entity.name.type.object.qml') ||
        scopes.includes('entity.name.type.attached.qml')) {
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

    return undefined;
  }
}
