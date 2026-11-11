// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QmlTmScopeMatcher, QmlTmScopeMatchResult } from './types';

const orderedTmMatchers: QmlTmScopeMatcher[] = [
  matchModuleScope,
  matchQtEnumScope,
  matchQmlAttribute,
  matchQmlType,
];

export function matchTmScopes(scopes: string[]) {
  for (const matcher of orderedTmMatchers) {
    const r = matcher(scopes);
    if (r) {
      return r;
    }
  }

  return undefined;
}

// matchers
function matchModuleScope(scopes: string[]): QmlTmScopeMatchResult | undefined {
  const regex = /^meta\.doc\.module\.(.+)\.qml$/;
  const moduleName = regex.exec(scopes.at(-1) ?? '')?.[1];
  if (!moduleName) {
    return undefined;
  }

  return {
    kind: 'module',
    moduleName
  };
}

function matchQtEnumScope(scopes: string[]): QmlTmScopeMatchResult | undefined {
  const regex = /^meta\.doc\.qt-enum\.(.+)\.qml$/;
  const name = regex.exec(scopes.at(-1) ?? '')?.[1];
  if (!name) {
    return undefined;
  }

  return {
    kind: 'qt-enum',
    valueName: name
  };
}

function matchQmlAttribute(scopes: string[]): QmlTmScopeMatchResult | undefined {
  const regex = /^meta\.doc\.member\.(.+)\.qml$/;
  const attr = regex.exec(scopes.at(-1) ?? '')?.[1];
  if (!attr) {
    return undefined;
  }

  const typeName = findMostRelevantQmlTypeName(scopes);
  if (!typeName) {
    return undefined;
  }

  return {
    kind: 'attribute',
    typeName,
    attributeName: withGroupPrefix(scopes, attr),
    attached: isAttached(scopes),
    signalHandler: scopes.includes('entity.name.function.handler.qml')
  };
}

function matchQmlType(scopes: string[]): QmlTmScopeMatchResult | undefined {
  const typeRegex = /^meta\.doc\.type\.(.+)\.qml$/;
  const typeReferenceRegex = new Set([
    'entity.name.type.attached.qml', // 'Layout' in 'Layout.fillWidth'
    'storage.type.primitive.qml', // 'bool' in 'property bool x'
    'entity.name.type.qml', // 'Item' in 'property Item x', 'signal s(i: Item)'
    'support.class.qt.qml' // 'Qt' in 'Qt.rgba()'
  ]);

  const last = scopes.at(-1) ?? '';
  const isTypeReference = typeReferenceRegex.has(scopes.at(-2) ?? '');
  const referencedTypeName = typeRegex.exec(last)?.[1];
  if (isTypeReference && referencedTypeName) {
    return {
      kind: 'type',
      typeName: referencedTypeName
    };
  }

  if (last === 'entity.name.type.object.qml') {
    const typeName = findMostRelevantQmlTypeName(scopes);
    return typeName ? { kind: 'type', typeName } : undefined;
  }

  return undefined;
}

// helpers
function findMostRelevantQmlTypeName(scopes: string[]) {
  const types: string[] = [];
  const regex = /^meta\.doc\.type\.(.+)\.qml$/;

  for (const scope of scopes) {
    const name = regex.exec(scope)?.[1];
    if (name) {
      types.push(name);
    }
  }

  // Item { x: 100 }: 'x' belongs to the 'Item'
  // Item { Behavior on x { ... } }: 'x' belongs to the 'Item'
  const goUp = scopes.includes('meta.doc.on-target.qml');
  return goUp ? types.at(-2) : types.at(-1);
}

function isAttached(scopes: string[]) {
  // Layout.fillWidth: the attached type follows the attribute name scope
  // ... entity.other.attribute-name.qml meta.doc.type.Layout.qml ...
  const typeRegex = /^meta\.doc\.type\.(.+)\.qml$/;
  const attrNameAt = scopes.indexOf('entity.other.attribute-name.qml');
  return (
    attrNameAt >= 0 &&
    scopes.slice(attrNameAt + 1).some((s) => typeRegex.test(s))
  );
}

function withGroupPrefix(scopes: string[], attr: string) {
  // border { width: 2 }: width -> border.width
  // font { family: qsTr("x") }: qsTr -> Qt.qsTr

  let group: string | undefined;
  const typeRegex = /^meta\.doc\.type\.(.+)\.qml$/;
  const groupRegex = /^meta\.doc\.group\.(.+)\.qml$/;

  for (const scope of scopes) {
    if (typeRegex.test(scope)) {
      group = undefined; // a group belongs to the type before it
    }

    group = groupRegex.exec(scope)?.[1] ?? group;
  }

  return (group === undefined || group === attr)
    ? attr
    : `${group}.${attr}`;
}
