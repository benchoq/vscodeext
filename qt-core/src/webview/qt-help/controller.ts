// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  Uri,
  Disposable,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';
import _ from 'lodash';
import * as path from 'path';

import { telemetry, DisposableStore } from 'qt-lib';
import { fsFile } from '@/fs-utils';
import { setupWebApp, createPanel } from '@/webview/utils';
import { docViewerInfra as infra } from '@/webview/doc-viewer/infra';
import { type OpenOptions } from '@/webview/shared/doc-viewer';
import { QtHelpDispatcher } from './dispatcher';
import { QtHelpDataManager } from './data/data-manager';
import * as consts from './constants';
import { isQmlTmScopeMatchResult, type QmlTmScopeMatchResult } from '@/docs/qml/types';

let instance: QtHelpController | undefined;
let data: QtHelpDataManager | undefined;

export function addQtHelp(context: Context) {
  const openCmd = 'openQtHelp';
  const openCmdFull = `${consts.EXTENSION_ID}.${openCmd}`;

  initDataManager(context);

  context.subscriptions.push(
    commands.registerCommand(openCmdFull, () => {
      telemetry.sendAction(openCmd);
      QtHelpController.render(context);
    }),

    commands.registerCommand(
      'qt-core.openQtHelpFromEditor',
      async (arg?: unknown) => {
        if (!isQmlTmScopeMatchResult(arg)) {
          return;
        }

        const docUri = await findDocUri(arg);
        if (docUri) {
          commands.executeCommand('qt-core.openDocViewer', docUri, {
            origin: 'hover-provider',
            syncPanelTitle: true
          } satisfies OpenOptions);
        }
      }
    )
  );
}

export class QtHelpController implements Disposable {
  private readonly _dispatcher: QtHelpDispatcher;
  private readonly _disposables = new DisposableStore();

  private constructor(
    context: Context,
    private readonly _panel: Panel
  ) {
    setupWebApp(consts.AppId, context, this._panel);

    this._dispatcher = new QtHelpDispatcher(
      context,
      this._panel,
      infra,
      getDataManager()
    );
    this._disposables.push(
      this._dispatcher,
      this._panel.onDidDispose(this.dispose.bind(this))
    );
  }

  public dispose() {
    instance = undefined;
    this._disposables.dispose();
  }

  public static render(context: Context) {
    instance ??= new QtHelpController(context, createPanel(consts.AppId));
    instance._panel.reveal();
  }
}

// helpers
async function findDocUri(arg: QmlTmScopeMatchResult) {
  const docs = getDataManager();

  if (arg.kind === 'module') {
    const { docPackage, entry } = await docs.findQmlModuleDocs(arg.moduleName);
    if (!docPackage || !entry) {
      return undefined;
    }

    return Uri.file(path.join(docPackage.fsPath, entry.filePathRel));
  }

  if (arg.kind === 'qt-enum') {
    const { docPackage, entry } = await docs.findIndexEntry(
      `Qt::${arg.valueName}`
    );
    if (!docPackage || !entry) {
      return undefined;
    }

    const docPath = path.join(docPackage.fsPath, entry.filePathRel);
    return Uri.file(docPath).with({ fragment: entry.anchor ?? '' });
  }

  // 'T.Button' with 'import QtQuick.Templates as T' -> 'Button'
  const typeName = arg.typeName.split('.').at(-1) ?? '';
  const { docPackage, entry } = await docs.findQmlTypeDocs(typeName);
  if (!docPackage || !entry) {
    return undefined;
  }

  if (arg.kind === 'attribute') {
    return findMemberDocUri(
      docPackage.fsPath,
      entry.filePathRel,
      arg.attributeName
    );
  }

  return Uri.file(path.join(docPackage.fsPath, entry.filePathRel));
}

function initDataManager(context: Context) {
  if (!data) {
    data = new QtHelpDataManager(context);
  }

  const all = data.readAllDocRoots();
  const anyDoc = all[0];

  if (anyDoc) {
    data.selectDoc(anyDoc);
  }
}

function getDataManager(): QtHelpDataManager {
  if (!data) {
    throw new Error('QtHelpDataManager not initialized');
  }

  return data;
}

function findMemberDocUri(
  docRoot: string,
  typeDocPathRel: string,
  attributeName: string
) {
  const membersPathRel = typeDocPathRel.replace(/\.html$/, '-members.html');
  const membersPath = path.join(docRoot, membersPathRel);

  const href =
    findMemberLink(membersPath, attributeName) ??
    findChangedPropertyLink(membersPath, attributeName);
  if (!href) {
    return Uri.file(membersPath);
  }

  const [targetFile = '', fragment = ''] = href.split('#');
  const targetPath = path.resolve(path.dirname(membersPath), targetFile);

  return Uri.file(targetPath).with({ fragment });
}

// 'widthChanged' -> 'width'
function findChangedPropertyLink(membersPath: string, signalName: string) {
  const suffix = 'Changed';
  if (!signalName.endsWith(suffix)) {
    return undefined;
  }

  const propertyName = signalName.slice(0, -suffix.length);
  return findMemberLink(membersPath, propertyName);
}

function findMemberLink(membersPath: string, attributeName: string) {
  const file = fsFile(membersPath);
  if (!file.exists()) {
    return undefined;
  }

  const html = file.readAll().toString();
  const name = _.escapeRegExp(attributeName);
  const linkPattern = new RegExp(`<a href="([^"]+)"[^>]*>${name}</a>`);

  return linkPattern.exec(html)?.[1];
}
