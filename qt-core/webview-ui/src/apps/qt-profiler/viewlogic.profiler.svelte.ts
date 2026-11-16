// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import {
  isRpcOutput,
  type RpcOutput,
  type TraceData,
  type ProfilerConfig
} from './types';

export async function loadProfiler(trace: TraceData, c: ProfilerConfig) {
  const w = window as unknown as QtWasmWindow;
  const fileToLoad = `/traces/${trace.fileName}`;

  await loadScript(`${c.distUri}/qtloader.js`);
  await loadScript(`${c.distUri}/qtprofiler.js`);

  w.qtLoad({
    qt: {
      containerElements: [c.containerEl],
      entryFunction: w.qtprofiler_entry,
      fontDpi: 85,
      onLoaded: () => log("Application loaded"),
      onExit
    },
    arguments: ['--rpc', '--embedded', fileToLoad],
    print: createPrint(c.onRpcMessage),
    printErr: (line: string) => log(line),
    locateFile: (p) => `${c.distUri}/${p}`,
    preRun: [module => {
      module.FS.mkdir('/traces');
      module.FS.writeFile(fileToLoad, trace.bytes);
    }]
  });
}

export function log(...args: unknown[]) {
  console.log('[Qt Profiler]', ...args);
}

// helpers, local types
function createPrint(onRpcMessage: (msg: RpcOutput) => void) {
  return (line: string) => {
    let msg;

    try {
      msg = JSON.parse(line);
    } catch {
      log('Invalid JSON output');
      return;
    }

    if (!isRpcOutput(msg)) {
      log('Invalid RPC message');
      return;
    }

    onRpcMessage(msg);
  };
}

function onExit(data: unknown) {
  const code = _.get(data, 'code', 0);
  const text = _.get(data, 'text', '');

  const texts = [
    'Application exit',
    code !== 0 ? `with code ${code}` : '',
    text.length !== 0 ? `(${text})` : ''
  ];

  log(texts);
}

async function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.append(s);
  });
}

interface QtWasmWindow {
  qtLoad: (_: QtWasmLoadArgs) => void,
  qtprofiler_entry: unknown;
}

interface QtWasmLoadArgs {
  qt: {
    entryFunction: unknown;
    containerElements: HTMLElement[];
    fontDpi: number;
    onLoaded: () => void
    onExit: (data: unknown) => void
  },
  arguments?: string[],
  locateFile?: (p: unknown) => string,
  print: (line: string) => void,
  printErr: (line: string) => void
  preRun?: [(module: {
    FS: {
      mkdir(path: string): void;
      writeFile(path: string, data: string | Uint8Array): void;
    }
  }) => void]
};
