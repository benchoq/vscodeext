// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { isRpcOutput } from "./types";
import { ui } from "./states.svelte";

interface QtLoadArgs {
  qt: {
    entryFunction: unknown;
    containerElements: HTMLElement[];
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

interface QtWindow {
  qtLoad: (_: QtLoadArgs) => Promise<void>,
  qtprofiler_entry: unknown;
}

export async function load(
  el: HTMLElement,
  dist: string,
  bytes: Uint8Array,
  fileName: string
) {
  ui.profiler.state = 'triggered';

  const traceDir = '/traces'
  const tracePath = `${traceDir}/${fileName}`;

  await loadScript(`${dist}/qtloader.js`);
  await loadScript(`${dist}/qtprofiler.js`);

  const w = window as unknown as QtWindow;
  await w.qtLoad({
    qt: {
      containerElements: [el],
      entryFunction: w.qtprofiler_entry,
    },
    arguments: ['--rpc', '--embedded', tracePath],
    locateFile: (p) => `${dist}/${p}`,
    print: onStdout,
    printErr: onStdError,
    preRun: [module => {
      module.FS.mkdir(traceDir);
      module.FS.writeFile(tracePath, bytes);
    }]
  });
}

function onStdout(line: string) {
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
      ui.profiler.state = 'loading';
      break;

    case 'traceFileLoadingFinished':
      ui.profiler.state = 'loaded';
      break;
  }
}

function onStdError(line: string) {
  console.error('[qtprofiler]', line);
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
