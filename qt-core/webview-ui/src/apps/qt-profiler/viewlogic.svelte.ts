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

  ui.profiler.state = 'triggered';

  await profiler.load(
    ui.container,
    data.configs.qtProfiler.distDir,
    data.bytes,
    data.configs.fileName
  );
}

async function updateConfigs() {
  const r = await vscode.post(CommandId.QtProfilerGetConfig);

  const c = data.configs;
  c.filePath = _.get(r, 'filePath', c.filePath);
  c.fileName =  _.get(r, 'fileName', c.fileName);
  c.qtProfiler.distDir = _.get(r, 'distDir', c.qtProfiler.distDir);
}

async function loadFileContent() {
  const start = performance.now();

  const r = await vscode.post(CommandId.QtProfilerReadBytes);
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
