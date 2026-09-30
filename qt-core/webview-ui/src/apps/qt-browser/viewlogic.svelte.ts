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
  const u = normalizeUri(uri);
  if (!u.startsWith(data.configs.serverOrigin)) {
    void vscode.post(CommandId.QtBrowserOpenUriExt, { uri });
    return;
  }

  console.log("++++++++++", u);

  // TODO: check if it's allowed to access
  ui.iframe.src = u;
  ui.history.push({
    title: 'aaa',
    href: u,
  });
}

export function navigate(dir: 'back' | 'forward') {
  const e = ui.history.go(dir);

  if (typeof e?.href === 'string') {
    openUri(e?.href);
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
    case ViewerMessageId.ViewerLoaded:
      // console.log('loaded from viewer', e.data);
      break;

    case ViewerMessageId.ViewerHoverChanged:
      if (typeof e.data.href === 'string') {
        ui.hoveredLink = e.data.href;
      }
      break;

    case ViewerMessageId.ViewerClicked:
      // console.log('clicked', e.data, typeof e.data?.href);
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

function normalizeUri(uri: string) {
  try {
    const u = new URL(uri);
    if (u.protocol === 'file:') {
      return `${data.configs.serverOrigin}${u.pathname}${u.hash}`;
    }
  } catch (e) {
    void e;
  }

  return uri;
}
