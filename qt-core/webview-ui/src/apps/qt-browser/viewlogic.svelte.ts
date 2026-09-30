// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId, type CommandReply } from '@shared/message';
import {
  isBookmarkEntry,
  ViewerMessageId,
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
  await loadBookmarks();
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

export function copySelection() {
  helpers.postToViewer(ViewerMessageId.CopySelection);
}

export async function updateBookmark(
  uri: string,
  title: string,
  action: 'add' | 'remove' | 'toggle'
) {
  const r = await vscode.post(CommandId.QtBrowserUpdateBookmark, {
    uri,
    title,
    action
  })

  const entries = _.get(r, 'entries', []);
  if (Array.isArray(entries) && entries.every(isBookmarkEntry)) {
    data.bookmarks = entries;
    console.log($state.snapshot(data.bookmarks));
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

export function isBookmarked(uri: string) {
  return data.bookmarks.findIndex((e) => e.uri === uri) !== -1;
}

// helpers
async function loadConfigs() {
  const r = await vscode.post(CommandId.QtBrowserGetConfig);
  data.configs.serverOrigin = String(_.get(r, 'serverOrigin', '')).trim();
}

async function loadBookmarks() {
  const r = await vscode.post(CommandId.QtBrowserGetBookmarks);
  const entries = _.get(r, 'entries', []);
  if (Array.isArray(entries) && entries.every(isBookmarkEntry)) {
    data.bookmarks = entries;
    console.log($state.snapshot(data.bookmarks));
  }
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
  switch (e.data?.id) {
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

    case ViewerMessageId.ViewerKeyDown: {
      const fields = e.data.fields;

      if (fields.key.toLowerCase() === 'c') {
        if (fields.metaKey || fields.ctrlKey) {
          helpers.postToViewer(ViewerMessageId.CopySelection);
          return;
        }
      }

      document.dispatchEvent(new KeyboardEvent('keydown', {
        ...fields,
        bubbles: true,
        cancelable: true,
      }));
      break;
    }

    case ViewerMessageId.ViewerContextMenu: {
      const r = ui.iframe.el?.getBoundingClientRect();
      if (r) {
        const x = r.left + e.data.x;
        const y = r.top + e.data.y;
        ui.popovers.contextMenu.pos = { x, y };
        ui.popovers.contextMenu.visible = true;
      }
      break;
    }

    case ViewerMessageId.ViewerMouseDown:
      ui.popovers.contextMenu.visible = false;
      break;

    default:
      break;
  }
}
