// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  languages,
  workspace,
  TextDocument,
  ExtensionContext
} from 'vscode';

import { createTmInfra } from '@/textmate/infra';
import { QmlTmHoverProvider } from './qml/hover';
import { QtRegexHoverProvider } from './regex-hover';

export function registerQtDocsHoverProviders(context: ExtensionContext) {
  const generalSelector = [
    { language: 'h' },
    { language: 'cpp' },
    { language: 'qt-ui' },
    { language: 'python' }
  ];

  const textmate = createTmInfra(context);
  const add = languages.registerHoverProvider;

  context.subscriptions.push(
    add([{ language: 'qml' }], new QmlTmHoverProvider(textmate)),
    add([{ language: 'cmake' }], new QtRegexHoverProvider(QtCMakePattern)),
    add(generalSelector, new QtRegexHoverProvider(QtGeneralPatternsMerged)),
  );

  context.subscriptions.push(
    workspace.onDidCloseTextDocument((doc: TextDocument) => {
      textmate.cache.release(doc);
    })
  );
}

// constants
const QtGeneralPatterns: RegExp[] = [
  /Q[A-Za-z][A-Za-z0-9_]*/, // Classes/types, e.g. QString, QColor, Qt
  /q[A-Z][A-Za-z0-9_]*/, // Global functions, e.g. qDebug, qRound, qColor
  /Q_[A-Z][A-Za-z0-9_]*/ // Macros, e.g. Q_ASSERT, Q_UNUSED
];

const QtCMakePattern = /\bqt_[a-z][a-z0-9_]*\b/; // e.g. qt_add_executable, qt_add_qml_module
const QtGeneralPatternsMerged = new RegExp(
  `\\b(?:${QtGeneralPatterns.map((p) => p.source).join('|')})\\b`
);
