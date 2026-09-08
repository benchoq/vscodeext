// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';

import { CommandId } from '@shared/message';
import { isIndexData, type IndexData } from '@shared/doc-browser';
import { data, ui } from './states.svelte';

export async function onAppMount() {
}

export async function onAppDestroy() {
}

export async function search(keyword: string) {
  const r = await vscode.post(CommandId.DocBrowserSearch, { keyword });
  if (Array.isArray(r) && r.every(isIndexData)) {
    data.data = r;
  }
}

export async function openDoc(entry: IndexData) {
  const r = await vscode.post(CommandId.DocBrowserOpen, {
    entry: $state.snapshot(entry)
  });

  const html = _.get(r, 'html', '');
  ui.selected.entry = entry;
  ui.selected.html = html;

  console.log(html);
}
