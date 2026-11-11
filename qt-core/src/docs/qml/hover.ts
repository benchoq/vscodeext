// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider } from 'vscode';

import { type TmInfra } from '@/textmate/infra';
import { TmScopesFinder } from '@/textmate/scopes-finder';
import { createMarkdownHover } from '@/docs/utils';
import { matchTmScopes } from './matcher';
import { type QmlTmScopeMatchResult } from './types';

export class QmlTmHoverProvider implements HoverProvider {
  private readonly _scopesFinder: TmScopesFinder;

  constructor(tm: TmInfra) {
    this._scopesFinder = new TmScopesFinder(tm, 'source.qml');
  }

  async provideHover(doc: TextDocument, pos: Position) {
    const scopes = (await this._scopesFinder.find(doc, pos)) ?? [];
    const matchResult = matchTmScopes(scopes);
    if (!matchResult) {
      return undefined;
    }

    return createMarkdownHover({
      command: 'qt-core.openQtHelpFromEditor',
      arg: matchResult,
      label: linkTextOf(matchResult),
      prefix: '$(book) Qt help: '
    });
  }
}

// helpers
function linkTextOf(r: QmlTmScopeMatchResult) {
  switch (r.kind) {
    case 'module':
      return `${r.moduleName} QML module`;

    case 'qt-enum':
      return `Qt.${r.valueName}`;

    case 'type':
      return `${r.typeName} QML type`;

    case 'attribute': {
      const signal = r.signalHandler ? ' signal' : '';
      const attached = r.attached ? ' (attached)' : '';
      return `${r.typeName}.${r.attributeName}${signal}${attached}`;
    }
  }
}
