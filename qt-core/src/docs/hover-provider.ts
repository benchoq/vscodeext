// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  languages,
  Hover,
  Position,
  TextDocument,
  HoverProvider,
  MarkdownString,
  ExtensionContext,
  workspace,
} from 'vscode';

import {
  lineStartStates,
  QmlHoverProvider
} from './hover-providers/qml-hover';

const QtGeneralPatterns: RegExp[] = [
  /Q[A-Za-z][A-Za-z0-9_]*/, // Classes/types, e.g. QString, QColor, Qt
  /q[A-Z][A-Za-z0-9_]*/, // Global functions, e.g. qDebug, qRound, qColor
  /Q_[A-Z][A-Za-z0-9_]*/ // Macros, e.g. Q_ASSERT, Q_UNUSED
];

const QtCMakePattern = /\bqt_[a-z][a-z0-9_]*\b/; // e.g. qt_add_executable, qt_add_qml_module
const QtGeneralPatternsMerged = new RegExp(
  `\\b(?:${QtGeneralPatterns.map((p) => p.source).join('|')})\\b`
);

class QtHoverProvider implements HoverProvider {
  constructor(private readonly _pattern: RegExp) {}

  provideHover(doc: TextDocument, pos: Position) {
    const range = doc.getWordRangeAtPosition(pos, this._pattern);
    if (!range) {
      return undefined;
    }

    if (doc.uri.toString().toLowerCase().endsWith('.qml')) {
      console.log('line:', doc.lineAt(pos.line));
      console.log('word:', doc.getText(range));

      return createHoverLinkQml(doc.getText(range));
    }

    return createHoverLink(doc.getText(range));
  }
}

export function registerQtDocsHoverProvider(context: ExtensionContext) {
  const generalSelector = [
    { language: 'h' },
    { language: 'cpp' },
    { language: 'qt-ui' },
    { language: 'python' }
  ];

  const cmakeSelector = [{ language: 'cmake' }];
  const register = languages.registerHoverProvider;

  context.subscriptions.push(
    register(cmakeSelector, new QtHoverProvider(QtCMakePattern)),
    register(generalSelector, new QtHoverProvider(QtGeneralPatternsMerged)),
    register([{ language: 'qml'}], new QmlHoverProvider()),
    workspace.onDidCloseTextDocument((doc: TextDocument) => {
      lineStartStates.release(doc);
    }),
  );
}

// helper
function createHoverLinkQml(keyword: string): Hover {
  const linkTarget = [
    'command:qt-core.openQtHelpFromEditor',
    encodeURIComponent(JSON.stringify(['qml', keyword].join(' ')))
  ].join('?');

  const link = `$(book) [${keyword}](${linkTarget})`;
  const markdown = new MarkdownString(link);
  markdown.isTrusted = true;
  markdown.supportThemeIcons = true;

  return new Hover(markdown);
}

function createHoverLink(linkText: string): Hover {
  const guide = '$(book)';
  const linkTarget = [
    'command:qt-core.documentationSearchForCurrentWord',
    encodeURIComponent(JSON.stringify([linkText]))
  ].join('?');

  const link = `${guide} [${linkText}](${linkTarget})`;
  const markdown = new MarkdownString(link);
  markdown.isTrusted = true;
  markdown.supportThemeIcons = true;

  return new Hover(markdown);
}
