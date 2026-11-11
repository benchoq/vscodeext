// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  Uri,
  Disposable,
  WebviewPanel as Panel,
  ExtensionContext as Context
} from 'vscode';
import * as path from 'path';

import { telemetry, DisposableStore } from 'qt-lib';
import { setupWebApp, createPanel } from '@/webview/utils';
import { docViewerInfra as infra } from '@/webview/doc-viewer/infra';
import { type OpenOptions } from '@/webview/shared/doc-viewer';
import { QtHelpDispatcher } from './dispatcher';
import { QtHelpDataManager } from './data/data-manager';
import * as consts from './constants';

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

    commands.registerCommand('qt-core.openQtHelpFromEditor', async (line?: string) => {
      const { docPackage, entry } = await getDataManager().searchKeyword(line ?? '');

      if (docPackage && entry) {
        const pathAbs = path.join(docPackage.fsPath, entry.filePathRel);
        // TODO: check existence
        commands.executeCommand(
          'qt-core.openDocViewer',
          Uri.file(pathAbs),
          { origin: 'hover-provider', syncPanelTitle: true } satisfies OpenOptions
        );
      }
    })
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

    this._dispatcher = new QtHelpDispatcher(context, this._panel, infra, getDataManager());
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