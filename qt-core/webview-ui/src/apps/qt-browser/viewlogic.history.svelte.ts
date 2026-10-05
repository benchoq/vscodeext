// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import { vscode } from '@/apps/vscode';
import {
  isHistoryEntry,
  type HistoryEdit,
  type HistoryEntry,
} from '@shared/qt-browser';

import { CommandId } from '@shared/message';
import { data } from './states.svelte';

export async function load() {
  const r = await vscode.post(CommandId.QtBrowserGetHistories);
  setHistories(_.get(r, 'entries', [] as HistoryEntry[]));
}

export async function edit(edit: HistoryEdit) {
  const r = await vscode.post(CommandId.QtBrowserEditHistories, { edit });
  setHistories(_.get(r, 'entries', [] as HistoryEntry[]));
}

// export function getSelection() {
//   return data.bookmarks
//     .filter((e) => e.checked)
//     .map(e => e.data);
// }

// export function setAllChecked(checked: boolean) {
//   data.bookmarks.forEach((e) => {
//     e.checked = checked;
//   });
// }

// export function has(uri: string) {
//   return data.bookmarks.some((e) => e.data.uri === uri);
// }

function setHistories(entries: HistoryEntry[]) {
  if (Array.isArray(entries) && entries.every(isHistoryEntry)) {
    data.histories = entries;
    // data.histories = entries.map((e) => {
    //   return {
    //     data: e,
    //     checked: false
    //   } as HistoryEntry
    // });

    console.log($state.snapshot(data.histories));
  }
}

