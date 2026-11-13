// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import type { TraceData, ProfilerConfig } from "./types";
import { ui } from './states.svelte';

function forceColorScheme(scheme: 'dark' | 'light') {
  const orig = window.matchMedia.bind(window);
  window.matchMedia = (q: string) => {
    const mql = orig(q);
    if (q.replace(/\s/g, '') !== '(prefers-color-scheme:dark)') return mql;
    return new Proxy(mql, {
      get: (t, p) => p === 'matches' ? scheme === 'dark'
        : typeof t[p] === 'function' ? t[p].bind(t) : t[p],
    });
  };
}

// type Scheme = 'dark' | 'light';

// let forced: Scheme = 'light';
// const listeners = new Set<EventListener>();

// // Qt 모듈 로드 전에 한 번 호출
// export function installColorSchemeOverride(initial: Scheme) {
//   forced = initial;
//   const orig = window.matchMedia.bind(window);
//   window.matchMedia = (q: string) => {
//     const mql = orig(q);
//     if (q.replace(/\s/g, '') !== '(prefers-color-scheme:dark)') return mql;
//     return new Proxy(mql, {
//       get: (t, p) => {
//         if (p === 'matches') return forced === 'dark';
//         if (p === 'addEventListener')
//           return (type: string, cb: EventListener) => {
//             if (type === 'change') listeners.add(cb);
//           };
//         if (p === 'removeEventListener')
//           return (type: string, cb: EventListener) => {
//             if (type === 'change') listeners.delete(cb);
//           };
//         const v = (t as any)[p];
//         return typeof v === 'function' ? v.bind(t) : v;
//       },
//     });
//   };
// }

// // 이후 언제든 호출
// export function setColorScheme(scheme: Scheme) {
//   if (forced === scheme) return;
//   forced = scheme;
//   const ev = { matches: scheme === 'dark', media: '(prefers-color-scheme: dark)' } as MediaQueryListEvent;
//   listeners.forEach((cb) => cb(ev));
// }

export async function runProfiler(trace: TraceData, c: ProfilerConfig) {
  // installColorSchemeOverride('dark');
  forceColorScheme(ui.theme.states.dark ? 'dark' : 'light');

  const w = window as unknown as QtWasmWindow;
  const fileToLoad = `/traces/${trace.fileName}`;

  await loadScript(`${c.distUri}/qtloader.js`);
  await loadScript(`${c.distUri}/qtprofiler.js`);

  await w.qtLoad({
    qt: {
      containerElements: [c.containerEl],
      entryFunction: w.qtprofiler_entry,
      fontDpi: c.fontDpi,
      // environment: {
      //   QT_QUICK_CONTROLS_STYLE: 'Material',
      //   QT_QUICK_CONTROLS_MATERIAL_THEME: 'Light',
      // }
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
    environment?: Record<string, string>;
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
