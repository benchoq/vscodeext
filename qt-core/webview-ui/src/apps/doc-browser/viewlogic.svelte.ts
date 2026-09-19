// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId, type CommandReply } from '@shared/message';
import {
  isTocEntry,
  isIndexMatch,
  isFullTextMatch,
  type HtmlPageInfo,
  ViewerMessageId
} from '@shared/doc-browser';
import { data, ui, type UiMode } from './states.svelte';
import type { FindAction } from './types.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onVscodeThemeChanged);

  window.addEventListener('message', onMessageFromViewer);
  vscode.onDidReceiveNotification(onMessageFromVscode);

  await updateConfigs();
  await loadToc();
  await loadIndexes();
}

export async function onAppDestroy() {
}

export function isCurrentDoc(e: HtmlPageInfo): boolean {
  const current = ui.history.currentEntry;
  if (!current) {
    return false;
  }

  return (
    current.title === e.title &&
    current.filePathRel === e.filePathRel &&
    current.anchor === e.anchor
  );
}

export function findInPage(action: FindAction) {
  const w = ui.iframeEl?.contentWindow
  if (!w) {
    return;
  }

  if (action === 'clear') {
    ui.popover.keyword = '';
    ui.popover.visible = false;
  }

  postToViewer(ViewerMessageId.FindInPage, {
    keyword: ui.popover.keyword,
    action
  });
}

export function setMode(mode: UiMode) {
  ui.mode = mode;
}

export function navigate(dir: 'back' | 'forward') {
  const entry = ui.history.go(dir);
  if (entry) {
    ui.selected.htmlUri = entry.filePathRel;
  }
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.DocBrowserSearch, { keyword });
  if (Array.isArray(r) && r.every(isFullTextMatch)) {
    data.fullText = r;
  }
}

export async function updateFilteredIndex() {
  const k = ui.index.filter.keyword.trim();
  if (k.length === 0) {
    ui.index.filtered = data.indexes;
    return;
  }

  ui.index.filtered = data.indexes.filter((v) => {
    return (v.name.toLowerCase().indexOf(ui.index.filter.keyword.toLowerCase()) !== -1);
  });
}

export async function openHtml(info: HtmlPageInfo) {
  const uri = [
    data.configs.serverOrigin,
    data.configs.serverOrigin.endsWith('/') ? '' : '/',
    info.filePathRel,
    info.anchor ? '#' + info.anchor : ''
  ].join('');

  ui.history.push(info);
  ui.selected.htmlUri = uri;
}

export async function loadToc() {
  const r = await vscode.post(CommandId.DocBrowserReadToc);
  if (Array.isArray(r) && r.every(isTocEntry)) {
    data.toc = r;
    ui.tocTree.rebuild(r);
  }
}

export async function loadIndexes() {
  const r = await vscode.post(CommandId.DocBrowserReadIndexes);
  if (Array.isArray(r) && r.every(isIndexMatch)) {
    data.indexes = r;
    updateFilteredIndex();
  }
}

export function scrollToAnchor(anchor: string | undefined) {
  if (anchor) {
    postToViewer(ViewerMessageId.ScrollToAnchor, { anchor });
  }
}

// helpers
async function updateConfigs() {
  const r = await vscode.post(CommandId.DocBrowserGetConfig);
  data.configs.serverOrigin = String(_.get(r, 'serverOrigin', '')).trim();
}

function onVscodeThemeChanged() {
  postToViewer(ViewerMessageId.ApplyVscodeTheme, {
    vars: ui.theme.getAllVscodeCssVars()
  });
}

async function onMessageFromVscode(reply: CommandReply) {
  if (reply.id === CommandId.DocBrowserReload) {
    postToViewer(ViewerMessageId.ReloadPage);
  }
}

function onMessageFromViewer(e: MessageEvent) {
  if (e.data?.type === ViewerMessageId.Loaded) {
    postToViewer(ViewerMessageId.ApplyVscodeTheme, {
      vars: ui.theme.getAllVscodeCssVars()
    });
  }
}

function postToViewer(id: ViewerMessageId, data = {}) {
  ui.iframeEl?.contentWindow?.postMessage(
    { type: id, ...data }, '*'
  );
}
