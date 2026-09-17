// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import {
  isTocEntry,
  isIndexData,
  isFullTextSearchData,
  type HtmlEntry,
} from '@shared/doc-browser';
import { data, ui, type UiMode } from './states.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(postCssVarsToBrowser);

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'docbrowser-ready') {
      postCssVarsToBrowser();
    }
  });
}

export async function onAppDestroy() {
}

export function isCurrentDoc(e: HtmlEntry): boolean {
  if (!ui.selected.htmlEntry) {
    return false;
  }

  return (
    ui.selected.htmlEntry.title === e.title &&
    ui.selected.htmlEntry.filePathRel === e.filePathRel &&
    ui.selected.htmlEntry.anchor === e.anchor
  );
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
    ui.selected.htmlUri = entry.url;
  }

  console.log(entry);
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.DocBrowserSearch, {
    mode: ui.mode,
    keyword
  });

  if (ui.mode === 'index') {
    if (Array.isArray(r) && r.every(isIndexData)) {
      data.indexes = r;
    }
    return;
  }

  if (Array.isArray(r) && r.every(isFullTextSearchData)) {
    data.fullText = r;
  }

  console.log(r);
}

export async function openHtml(html: HtmlEntry) {
  const r = await vscode.post(CommandId.DocBrowserOpenHtml, {
    html: $state.snapshot(html)
  });

  ui.selected.htmlEntry = html;
  ui.selected.htmlUri = _.get(r, 'htmlUri', '');
  ui.history.push(ui.selected.htmlUri, html.title);
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
    type: 'docbrowser-theme-vars',
    vars: $state.snapshot(vars),
  }, '*');
}
