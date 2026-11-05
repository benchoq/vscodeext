// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import type { TraceData, ProfilerConfig } from "./types";

export async function runProfiler(trace: TraceData, c: ProfilerConfig) {
  const w = window as unknown as QtWasmWindow;
  const fileToLoad = `/traces/${trace.fileName}`;

  await loadScript(`${c.distUri}/qtloader.js`);
  await loadScript(`${c.distUri}/qtprofiler.js`);

  await w.qtLoad({
    qt: {
      containerElements: [c.containerEl],
      entryFunction: w.qtprofiler_entry,
      fontDpi: c.fontDpi
    },
    arguments: ['--rpc', '--embedded', fileToLoad],
    print: c.print,
    printErr: c.printErr,
    locateFile: (p) => `${c.distUri}/${p}`,
    preRun: [module => {
      module.FS.mkdir('/traces');
      module.FS.writeFile(fileToLoad, trace.bytes);
    }]
  });
}

// helpers, local types
async function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.append(s);
  });
}

interface QtWasmLoadArgs {
  qt: {
    entryFunction: unknown;
    containerElements: HTMLElement[];
    fontDpi: number;
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

interface QtWasmWindow {
  qtLoad: (_: QtWasmLoadArgs) => Promise<void>,
  qtprofiler_entry: unknown;
}
