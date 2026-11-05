// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import { data, ui } from './states.svelte';
import { runProfiler } from './viewlogic.profiler.svelte';
import { isRpcOutput } from "./types";

export async function onAppMount() {
  if (!ui.containerEl) {
    console.log('Invalid container for wasm');
    return;
  }

  ui.state = 'triggered';

  await readConfig();
  await readTraceData();

  await runProfiler(data.trace, {
    distUri: data.profilerDistUri,
    print,
    printErr,
    fontDpi: 85,
    containerEl: ui.containerEl
  });
}

// helpers
async function readConfig() {
  const r = await vscode.post(CommandId.QtProfilerGetConfig);
  data.profilerDistUri = _.get(r, 'profilerDistUri', '');
}

async function readTraceData() {
  const start = performance.now();
  const r = await vscode.post(CommandId.QtProfilerReadTraceData);
  const rawBytes = _.get(r, 'bytes');

  data.trace = {
    filePath: _.get(r, 'filePath', ''),
    fileName: _.get(r, 'fileName', ''),
    bytes: rawBytes
      ? new Uint8Array(rawBytes as ArrayLike<number>)
      : new Uint8Array()
  }

  const { bytes, ...traceInfo } = data.trace;

  console.log('QML trace loaded', {
    ...traceInfo,
    length: bytes.length,
    took: (performance.now() - start)
  });
}

function print(line: string) {
  let msg;

  try {
    msg = JSON.parse(line);
  } catch {
    console.log('Invalid reply');
    return;
  }

  if (!isRpcOutput(msg)) {
    console.log('Invalid reply');
    return;
  }

  switch (msg.method) {
    case 'traceFileLoadingStarted':
      ui.state = 'loading';
      break;

    case 'traceFileLoadingFinished':
      ui.state = 'loaded';
      break;

    case 'traceEventSelected': {
      void vscode.post(CommandId.QtProfilerEventSelected, msg.params);
      break;
    }
  }
}

function printErr(line: string) {
  console.error('[qtprofiler]', line);
}
