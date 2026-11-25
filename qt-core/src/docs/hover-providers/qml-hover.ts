// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { Position, TextDocument, HoverProvider } from 'vscode';

import { HoverInfo, ScopeMatchResult } from './types';
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
    const result = matchScopes(scopes);

    console.log('textmate:', scopes);
    console.log('match', result);

    if (result) {
      return createMarkdownHover(result);
    }

    // if (scopes.includes('entity.name.type.object.qml') ||
    //     scopes.includes('entity.name.type.attached.qml')) {
    //   return createMarkdownHover({ keyword: info.word, appendix: '' })
    // }

    // if (scopes.includes('storage.type.primitive.qml')) {
    //   return createMarkdownHover({ keyword: info.word, appendix: '' })
    // }

    // if (scopes.includes('entity.name.namespace.qml') && scopes.includes('meta.import.qml')) {
    //   return createMarkdownHover({ keyword: info.word, appendix: '' })
    // }

    // if (scopes.includes('meta.pragma.qml')) {
    //   if (scopes.includes('entity.other.attribute-name.pragma.qml') || scopes.includes('constant.language.pragma.qml')) {
    //     return createMarkdownHover({ keyword: 'structure of qml document', appendix: '' })
    //   }
    // }

    return undefined;
  }
}

// `width: 100` inside `Rectangle {`, hover on `width` -> 'Rectangle', 'width'
// [
//   ...
//   'meta.doc.type.Rectangle.qml',
//   'entity.other.attribute-name.qml',
//   'meta.doc.member.width.qml'
// ]
//
// `Layout.fillWidth: true`, hover on `Layout` -> 'Layout'
// [
//   ...
//   'meta.doc.type.Rectangle.qml',
//   'entity.other.attribute-name.qml',
//   'entity.name.type.attached.qml',
//   'meta.doc.type.Layout.qml'
// ]
//
// `Rectangle {`, hover on `Rectangle` -> 'Rectangle'
// [
//   ...
//   'meta.doc.type.Rectangle.qml',
//   'entity.name.type.object.qml'
// ]
function matchScopes(scopes: string[]): ScopeMatchResult | undefined {
  const lastScope = scopes.at(-1) ?? '';

  const memberName = docMemberScope.exec(lastScope)?.[1];
  if (memberName) {
    return {
      kind: 'attribute',
      typeName: findDocType(scopes) ?? '',
      attributeName: withGroupPrefix(scopes, memberName)
    }
  }

  const isAttachedTypeName = scopes.at(-2) === 'entity.name.type.attached.qml';
  const attachedTypeName = docTypeScope.exec(lastScope)?.[1];
  if (isAttachedTypeName && attachedTypeName) {
    return {
      kind: 'object',
      typeName: attachedTypeName
    }
  }

  if (lastScope === 'entity.name.type.object.qml') {
    return {
      kind: 'object',
      typeName: findDocType(scopes) ?? ''
    }
  }

  return undefined;
}

const docTypeScope = /^meta\.doc\.type\.(.+)\.qml$/;
const docMemberScope = /^meta\.doc\.member\.(.+)\.qml$/;
const docGroupScope = /^meta\.doc\.group\.(.+)\.qml$/;

// `Behavior on x`: `x` belongs to the type outside `Behavior`
function findDocType(scopes: string[]) {
  const typeNames = findAllCaptures(scopes, docTypeScope);
  const isOnTarget = scopes.includes('meta.doc.on-target.qml');

  return isOnTarget ? typeNames.at(-2) : typeNames.at(-1);
}

// `border { width: 2 }`, member `width` -> 'border.width'
function withGroupPrefix(scopes: string[], memberName: string) {
  const groupName = findAllCaptures(scopes, docGroupScope).at(-1);
  const isInsideGroup = groupName !== undefined && groupName !== memberName;

  return isInsideGroup ? `${groupName}.${memberName}` : memberName;
}

function findAllCaptures(scopes: string[], pattern: RegExp) {
  const captures: string[] = [];

  for (const scope of scopes) {
    const capture = pattern.exec(scope)?.[1];
    if (capture) {
      captures.push(capture);
    }
  }

  return captures;
}

// matchScopes() results, tokenized with qml.qmlproject.tmLanguage.json
//
// Rectangle {
//     width: 100
//     anchors.fill: parent
//     border { width: 2 }
//     Layout.fillWidth: true
//     onClicked: foo()
//     onWidthChanged: bar()
//     Component.onCompleted: baz()
//     Behavior on x { NumberAnimation {} }
//     Behavior on anchors.leftMargin {}
//     Behavior { enabled: false }
//     Text
//     {
//         text: "hi"
//     }
// }
//
// token                kind       typeName . attributeName
// -------------------  ---------  ---------------------------------
// Rectangle            object     Rectangle
// width                attribute  Rectangle . width
// anchors              attribute  Rectangle . anchors
// fill                 attribute  Rectangle . anchors.fill
// border               attribute  Rectangle . border
// width (in border)    attribute  Rectangle . border.width
// Layout               object     Layout
// fillWidth            attribute  Layout . fillWidth
// onClicked            attribute  Rectangle . clicked
// onWidthChanged       attribute  Rectangle . widthChanged
// Component            object     Component
// onCompleted          attribute  Component . completed
// Behavior             object     Behavior
// x                    attribute  Rectangle . x
// NumberAnimation      object     NumberAnimation
// anchors.leftMargin   attribute  Rectangle . anchors.leftMargin
// enabled              attribute  Behavior . enabled
// Text                 object     Text
// text                 attribute  Text . text
//
// No match: `:`, `.`, `{`, `}`, `on`, values and expressions
// (`100`, `parent`, `true`, `foo()`, `"hi"`, ...)
