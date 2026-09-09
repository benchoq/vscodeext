// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import { isIndexData, isTocEntry, type IndexData, type TocEntry } from '@shared/doc-browser';
import { data, ui, type UiMode } from './states.svelte';

export async function onAppMount() {
}

export async function onAppDestroy() {
}

export function setMode(mode: UiMode) {
  ui.mode = mode;

  if (ui.mode === 'toc') {
    loadToc();
  }

  console.log(mode);
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.DocBrowserSearch, { keyword });
  if (Array.isArray(r) && r.every(isIndexData)) {
    data.indexes = r;
  }
}

export async function openDoc(index: IndexData) {
  const r = await vscode.post(CommandId.DocBrowserOpenDocFromIndex, {
    index: $state.snapshot(index)
  });

  const html = _.get(r, 'html', '');

  ui.selected.index = index;
  ui.selected.html = html;

  console.log(html);
}

export async function openDocFromToc(toc: TocEntry) {
  const r = await vscode.post(CommandId.DocBrowserOpenDocFromToc, {
    toc: $state.snapshot(toc)
  });

  const html = _.get(r, 'html', '');
  ui.selected.toc = toc;
  ui.selected.html = html;

  console.log(html);
}

export async function loadToc() {
  const r = await vscode.post(CommandId.DocBrowserReadToc);
  if (Array.isArray(r) && r.every(isTocEntry)) {
    data.toc = r;
  } else {
    console.log(r);
  }
}
