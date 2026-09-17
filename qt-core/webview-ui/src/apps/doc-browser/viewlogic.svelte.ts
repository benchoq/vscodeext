// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import {
  isTocEntry,
  isIndexMatch,
  isFullTextMatch,
  type HtmlPageInfo,
  ViewerActionId
} from '@shared/doc-browser';
import { data, ui, type UiMode } from './states.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(postCssVarsToBrowser);

  await updateConfigs();

  window.addEventListener('message', (event) => {
    if (event.data?.type === ViewerActionId.NotifyViewerReady) {
      postCssVarsToBrowser();
    }
  });
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

export function findInCurrentDoc(keyword: string) {
  const w = ui.iframeEl?.contentWindow
  if (keyword.length === 0 || !w) {
    return;
  }

  // TODO
}

export function setMode(mode: UiMode) {
  ui.mode = mode;

  if (ui.mode === 'toc') {
    loadToc();
  }
}

export function navigate(dir: 'back' | 'forward') {
  const entry = ui.history.go(dir);
  if (entry) {
    ui.selected.htmlUri = entry.filePathRel;
  }

  console.log(entry);
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.DocBrowserSearch, {
    mode: ui.mode,
    keyword
  });

  if (ui.mode === 'index') {
    if (Array.isArray(r) && r.every(isIndexMatch)) {
      data.indexes = r;
    }
    return;
  }

  if (Array.isArray(r) && r.every(isFullTextMatch)) {
    data.fullText = r;
  }

  console.log(r);
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

// helpers
function postCssVarsToBrowser() {
  if (!ui.iframeEl) {
    return;
  }

  const vars = ui.theme.getAllVscodeCssVars();
  ui.iframeEl?.contentWindow?.postMessage({
    type: ViewerActionId.ApplyVscodeTheme,
    vars: $state.snapshot(vars),
  }, '*');
}

async function updateConfigs() {
  const r = await vscode.post(CommandId.DocBrowserGetConfig);
  data.configs.serverOrigin = String(_.get(r, 'serverOrigin', '')).trim();
}
