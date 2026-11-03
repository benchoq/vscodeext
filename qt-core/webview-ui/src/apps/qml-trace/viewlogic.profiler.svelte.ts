// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

interface QtLoadArgs {
  qt: {
    entryFunction: unknown;
    containerElements: HTMLElement[];
  },
  arguments?: string[],
  locateFile?: (p: unknown) => string,
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

export async function load(ui: HTMLElement, dist: string, bytes: Uint8Array) {
  await loadScript(`${dist}/qtloader.js`);
  await loadScript(`${dist}/qtprofiler.js`);

  const w = window as unknown as QtWindow;
  await w.qtLoad({
    qt: {
      containerElements: [ui],
      entryFunction: w.qtprofiler_entry,
    },
    arguments: ['--embedded', '/traces/trace.qtd'],
    locateFile: (p) => `${dist}/${p}`,
    preRun: [module => {
      module.FS.mkdir('/traces');
      module.FS.writeFile('/traces/trace.qtd', bytes);
    }]
  });
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
