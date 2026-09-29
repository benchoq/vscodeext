// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import {
  ViewerMessageId
} from '@shared/qt-browser';

import { data, ui } from './states.svelte';
import { type FindAction } from './types.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onVscodeThemeChanged);

  window.addEventListener('message', onMessageFromViewer);

  await loadConfigs();
}

export async function onAppDestroy() {
}

export async function openUri(uri: string) {
  const r = await vscode.post(CommandId.QtBrowserResolveUri, { uri })
  const resolved = _.get(r, 'uri', '');


  if (typeof resolved === 'string' && resolved.length > 0) {
    ui.iframe.src = resolved;
    console.log('resolved change', ui.iframe.src);
  }
}

export function findInPage(action: FindAction) {
  const w = ui.iframe.el?.contentWindow
  if (!w) {
    return;
  }

  if (action === 'clear') {
    ui.popovers.find.keyword = '';
    ui.popovers.find.visible = false;
  }

  postToViewer(ViewerMessageId.FindInPage, {
    keyword: ui.popovers.find.keyword,
    action
  });
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

function onMessageFromViewer(e: MessageEvent) {
  switch (e.data?.type) {
    case ViewerMessageId.Loaded:
      console.log('loaded from viewer', e.data);
      break;

    case ViewerMessageId.ViewerHoverChanged:
      console.log('hovered', e.data);
      break;

    case ViewerMessageId.ViewerClickExternal:
      console.log('ext-clicked', e.data, typeof e.data?.href);
      if (typeof e.data?.href === 'string') {
        openUri(e.data?.href);
      }
      break;

    default:
      break;
  }
    // if (ui.recentPageLoadContext !== 'history') {
    //   ui.history.pushUrl(new URL(e.data.href));
    // }

  //   ui.recentPageLoadContext = '';
  //   postToViewer(ViewerMessageId.ApplyVscodeTheme, {
  //     vars: ui.theme.getAllVscodeCssVars()
  //   });
  // } else if (e.data?.type === ViewerMessageId.ViewerHoverChanged) {
  //   ui.hoveredLink = e.data?.href ?? '';
  // }
}


function postToViewer(id: ViewerMessageId, data = {}) {
  ui.iframe.el?.contentWindow?.postMessage(
    { type: id, ...data }, '*'
  );
}
