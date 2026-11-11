// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export type QmlTmScopeMatchResult =
  | { kind: 'module'; moduleName: string } // 'import QtQuick.Layouts'
  | { kind: 'type'; typeName: string } // 'Item'
  | {
      kind: 'attribute';
      typeName: string;
      attributeName: string;
      attached: boolean; // 'fillWidth' in 'Layout.fillWidth'
      signalHandler: boolean; // 'onClicked': attributeName is 'clicked'
    }
  | { kind: 'qt-enum'; valueName: string }; // 'Qt.AlignLeft' -> 'AlignLeft'

export type QmlTmScopeMatcher = (scopes: string[]) => QmlTmScopeMatchResult | undefined;

export function isQmlTmScopeMatchResult(x: unknown): x is QmlTmScopeMatchResult {
  if (typeof x !== 'object' || x === null) {
    return false;
  }

  const r = x as Record<string, unknown>;

  switch (r.kind) {
    case 'type':
      return typeof r.typeName === 'string';

    case 'attribute':
      return (
        typeof r.typeName === 'string' &&
        typeof r.attributeName === 'string' &&
        typeof r.attached === 'boolean' &&
        typeof r.signalHandler === 'boolean'
      );

    case 'module':
      return typeof r.moduleName === 'string';

    case 'qt-enum':
      return typeof r.valueName === 'string';

    default:
      return false;
  }
}
