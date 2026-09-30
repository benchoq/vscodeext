// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId, type CommandReply } from '@shared/message';
import {
  ViewerMessageId
} from '@shared/qt-browser';

import { data, ui } from './states.svelte';
import { type FindAction } from './types.svelte';
import * as helpers from './helpers';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onVscodeThemeChanged);
  window.addEventListener('message', onMessageFromViewer);
  vscode.onDidReceiveNotification(onMessageFromVscode);

  await loadConfigs();
}

export async function onAppDestroy() {
}

export async function openUri(uri: string) {
  const u = helpers.toLocalServerUri(uri);

  if (!u.startsWith(data.configs.serverOrigin)) {
    void vscode.post(CommandId.QtBrowserOpenUriExt, { uri });
    return;
  }

  // TODO: check if it's allowed to access or exists
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

  helpers.postToViewer(ViewerMessageId.FindInPage, {
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
  helpers.postToViewer(ViewerMessageId.ApplyVscodeTheme, {
    vars: ui.theme.getAllVscodeCssVars()
  });
}

function onMessageFromVscode(reply: CommandReply) {
  if (reply.id === CommandId.QtBrowserReloadPage) {
    helpers.postToViewer(ViewerMessageId.ReloadPage);
  }
}

function onMessageFromViewer(e: MessageEvent) {
  switch (e.data?.type) {
    case ViewerMessageId.ViewerLoaded:
      ui.iframe.hoveredUri = '';
      ui.iframe.title = e.data.title;
      void vscode.post(CommandId.QtBrowserSetTitle, { title: e.data.title });
      break;

    case ViewerMessageId.ViewerHoverChanged:
      if (typeof e.data.href === 'string') {
        ui.iframe.hoveredUri = helpers.toFileUri(e.data.href);
      }
      break;

    case ViewerMessageId.ViewerClicked:
      if (typeof e.data?.href === 'string') {
        openUri(e.data?.href);
      }
      break;

    case ViewerMessageId.ViewerKeyDown:
      document.dispatchEvent(new KeyboardEvent('keydown', {
        ...e.data.fields,
        bubbles: true,
        cancelable: true,
      }));
      break;

    case ViewerMessageId.ViewerContextMenu:
      console.log('contextmenu');
      break;

    case ViewerMessageId.ViewerMouseDown:
      console.log('mousedown');
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
