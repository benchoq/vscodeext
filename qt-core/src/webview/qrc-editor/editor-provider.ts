// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  window,
  workspace,
  TextDocument as Doc,
  WebviewPanel as Panel,
  ExtensionContext as Context,
  CancellationToken as Token,
  CustomTextEditorProvider as EditorProvider,
  ConfigurationTarget
} from 'vscode';

import { telemetry, DisposableStore, settings } from 'qt-lib';
import { EXTENSION_ID } from '@/constants';
import { setupWebApp } from '@/webview/utils';
import { QrcDocsManager } from './docs-manager';
import { QrcEditorController as Controller } from './controller';

const editorType = `${EXTENSION_ID}.qrcEditor`;

export function addQrcFileSupport(context: Context) {
  const provider = new QrcEditorProvider(context);

  context.subscriptions.push(
    provider,
    window.registerCustomEditorProvider(editorType, provider)
  );

  // Set initial editor association based on the setting
  const config = settings.core.enableQrcEditor;
  updateEditorAssociation(config.get() ?? true);

  // Listen for configuration changes
  const configListener = workspace.onDidChangeConfiguration((e) => {
    if (config.affectedBy(e)) {
      updateEditorAssociation(config.get() ?? true);
    }
  });

  context.subscriptions.push(configListener);
}

class QrcEditorProvider implements EditorProvider {
  private readonly _context: Context;
  private readonly _docsManager = new QrcDocsManager();
  private readonly _controllers = new Map<Panel, Controller>();
  private readonly _disposables = new DisposableStore();

  constructor(context: Context) {
    this._context = context;
    this._disposables.push(this._docsManager);
  }

  public dispose() {
    this._disposables.dispose();
  }

  public async resolveCustomTextEditor(doc: Doc, panel: Panel, token: Token) {
    void token;

    setupWebApp('qrc-editor', this._context, panel);

    this._docsManager.add(doc);
    const controller = new Controller(panel, this._docsManager, doc.uri.fsPath);
    this._controllers.set(panel, controller);

    panel.onDidDispose(() => {
      controller.dispose();
      this._controllers.delete(panel);
    });

    telemetry.sendEvent('QRCEditor:resolveCustomTextEditor');

    return Promise.resolve();
  }
}

function updateEditorAssociation(enable: boolean) {
  const config = settings.others.editorAssociations;

  const all = config.get() ?? {};
  const qrcAssociation = enable ? editorType : 'default';

  if (all['*.qrc'] !== qrcAssociation) {
    const value = { ...all, '*.qrc': qrcAssociation };
    void config.update(value, ConfigurationTarget.Global);
  }
}
