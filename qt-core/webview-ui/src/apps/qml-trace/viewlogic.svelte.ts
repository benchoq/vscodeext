// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import { data, ui } from './states.svelte';
import * as profiler from './viewlogic.profiler.svelte';

export async function onAppMount() {
  await updateConfigs();
  await loadFileContent();

  if (!ui.container) {
    console.log('Invalid container for wasm');
    return;
  }

  await profiler.load(
    ui.container,
    data.configs.qtProfiler.distDir,
    data.bytes
  );
}

export async function setConfigsAndReload(allDirs: string) {
  const additionalDirs: string[] = [];

  allDirs.split('\n').forEach(e => {
    const s = e.trim();
    if ((s.length !== 0) && (additionalDirs.indexOf(s) < 0)) {
      additionalDirs.push(s);
    }
  });

  await vscode.post(CommandId.QmlTraceSetConfigs, { additionalDirs });
  await updateConfigs();
}

export async function getFoldersToAdd(source: 'dialog' | 'workspaces') {
  const reply = (source === 'dialog')
    ? await vscode.post(CommandId.QmlTraceSelectFolder, undefined, -1)
    : await vscode.post(CommandId.QmlTraceGetWorkspaceFolders);

  if (reply) {
    const f = _.get(reply, 'folders', []) as string[];
    const ok = Array.isArray(f) && f.every((e) => (typeof e === 'string'));
    return ok ? f : [];
  }

  return [];
}

async function updateConfigs() {
  const r = await vscode.post(CommandId.QmlTraceGetConfigs);

  const c = data.configs;
  c.filePath = _.get(r, 'filePath', c.filePath);
  c.fileName =  _.get(r, 'fileName', c.fileName);
  c.additionalDirs = _.get(r, 'additionalDirs', c.additionalDirs);
  c.qtProfiler.distDir = _.get(r, 'distDir', c.qtProfiler.distDir);
}

async function loadFileContent() {
  const start = performance.now();

  const r = await vscode.post(CommandId.QmlTraceReadBytes);
  const raw = _.get(r, 'bytes');
  data.bytes = raw
    ? new Uint8Array(raw as ArrayLike<number>)
    : new Uint8Array();

  console.log('QML trace loaded', {
    fileName: data.configs.fileName,
    filePath: data.configs.filePath,
    length: data.bytes.length,
    took: (performance.now() - start)
  });
}
