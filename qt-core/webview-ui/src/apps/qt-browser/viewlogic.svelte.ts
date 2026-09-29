// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import {
  ViewerMessageId
} from '@shared/qt-browser';

import { data, ui } from './states.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onVscodeThemeChanged);

  await loadConfigs();
}

export async function onAppDestroy() {
}


export async function openUri(uri: string) {
  const r = await vscode.post(CommandId.QtBrowserResolveUri, { uri })
  const resolved = _.get(r, 'uri', '');

  if (typeof uri === 'string') {
    ui.iframe.src = resolved;
  }
}

// helpers
async function loadConfigs() {
  const r = await vscode.post(CommandId.QtBrowserGetConfig);
  data.configs.serverOrigin = String(_.get(r, 'serverOrigin', '')).trim();
}

function onVscodeThemeChanged() {
  postToViewer(ViewerMessageId.ApplyVscodeTheme, {
    vars: ui.theme.getAllVscodeCssVars()
  });
}

function postToViewer(id: ViewerMessageId, data = {}) {
  ui.iframe.el?.contentWindow?.postMessage(
    { type: id, ...data }, '*'
  );
}
