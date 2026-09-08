// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import { data } from './states.svelte';
import { isIndexData, type IndexData } from '@shared/doc-browser';

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
  await vscode.post(CommandId.DocBrowserOpen, {
    entry: $state.snapshot(entry)
  });
}
