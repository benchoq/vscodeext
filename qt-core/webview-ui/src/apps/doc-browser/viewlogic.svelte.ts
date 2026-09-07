// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
// import { data, ui } from './states.svelte';

export async function onAppMount() {
}

export async function onAppDestroy() {
}

export async function search(keyword: string) {
  await vscode.post(CommandId.DocBrowserSearch, { keyword });
}
