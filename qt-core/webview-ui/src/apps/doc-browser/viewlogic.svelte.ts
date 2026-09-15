// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import { isFullTextSearchData, isIndexData, isTocEntry, type FullTextSearchData, type IndexData, type TocEntry } from '@shared/doc-browser';
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

export async function openDoc(index: IndexData) {
  const r = await vscode.post(CommandId.DocBrowserOpenDocFromIndex, {
    index: $state.snapshot(index)
  });

  ui.selected.index = index;
  ui.selected.htmlUri = _.get(r, 'htmlUri', '');
}

export async function openDocFromToc(toc: TocEntry) {
  const r = await vscode.post(CommandId.DocBrowserOpenDocFromToc, {
    toc: $state.snapshot(toc)
  });

  ui.selected.toc = toc;
  ui.selected.htmlUri = _.get(r, 'htmlUri', '');
}

export async function openDocFromFullTextSearch(data: FullTextSearchData) {
  const r = await vscode.post(CommandId.DocBrowserOpenDocFromFullText, {
    search: $state.snapshot(data)
  });

  ui.selected.fullText = data;
  ui.selected.htmlUri = _.get(r, 'htmlUri', '');
}

export async function loadToc() {
  const r = await vscode.post(CommandId.DocBrowserReadToc);
  if (Array.isArray(r) && r.every(isTocEntry)) {
    data.toc = r;
    ui.tocTree.rebuild(r);
  }
}
