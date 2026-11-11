// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider } from 'vscode';

import { createMarkdownHover } from './utils';
import { HoverInfo, ResolvedResult, KeywordResolver } from './types';

export class QmlHoverProvider implements HoverProvider {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  provideHover(doc: TextDocument, pos: Position) {
    const range = doc.getWordRangeAtPosition(pos);
    const info: HoverInfo = {
      word: doc.getText(range),
      line: doc.lineAt(pos.line).text
    }

    for (const resolver of keywordResolvers) {
      const result = resolver(info);
      if (result) {
        return createMarkdownHover(result);
      }
    }

    return undefined;
  }
}

// helpers and local types
function resolveImport(info: HoverInfo): ResolvedResult | undefined {
  // import QtQuick
  // import QtQuick.Layouts
  // import QtQuick.Controls.Basic

  const re = /^[ \t]*import[ \t]+(Qt[\w.]*)/;
  const moduleName = re.exec(info.line)?.[1] ?? ''; // QtQuick.Layouts
  const keyword = moduleName // Qt Quick Layouts
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\./g, ' ');

  return keyword && moduleName.includes(info.word) ? {
    kind: 'qml-import',
    keyword,
    appendix: 'QML Types',
    linkText: moduleName
  } : undefined;
}

function resolveValueType(info: HoverInfo): ResolvedResult | undefined {
  // property bool lightMode: Application.styleHints.colorScheme === Qt.Light
  // property color reallyDark: "#1f1f1f"
  // property color dark: "#262626"
  // property color reallyLight: "#e7e7e7"
  // property color light: "#e0e0e0"

  const re = /^[ \t]*property[ \t]+([a-z]\w+)[ \t]/;
  const keyword = re.exec(info.line)?.[1] ?? '';
  return (keyword && keyword === info.word) ? {
    kind: 'qml-value-type',
    keyword: keyword,
    appendix: 'QML Value Type'
  } : undefined;
}

function resolveQmlType(info: HoverInfo): ResolvedResult | undefined {
  // Rectangle
  // ApplicationWindow
  // Layout.fillWidth => "Layout"
  // but, Qt.Light ==> 'Light' shouldn't match
  const re = /\b[A-Z][a-z0-9_]*(?:[A-Z][a-z0-9_]*)*\b/;
  const m = re.exec(info.word)?.[0] ?? '';
  return m ? {
    kind: 'qml-type',
    keyword: m,
    appendix: 'QML Type'
  } : undefined;
}

const keywordResolvers: KeywordResolver[] = [
  resolveImport,
  resolveValueType,
  resolveQmlType
]
