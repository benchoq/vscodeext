// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import { data, ui } from './states.svelte';
import { runProfiler } from './viewlogic.profiler.svelte';
import { isRpcOutput } from "./types";
import type { ThemeInfo } from '@/comps/VscodeThemeMonitor.svelte';

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged((prev: ThemeInfo, current: ThemeInfo) => {
    if (prev.dark !== current.dark) {
      void vscode.post(CommandId.QtProfilerReloadHtml);
    }
  });

  await readConfig();

  if (ui.containerEl) {
    setColorScheme(ui.theme.states.dark ? 'dark' : 'light');
    ui.state = 'triggered';

    await readTraceData();
    await runProfiler(data.trace, {
      distUri: data.profilerDistUri,
      print,
      printErr,
      fontDpi: 85,
      containerEl: ui.containerEl
    });
  }
}

export function overrideWindowOpenFunction() {
  const originalOpen = window.open;

  window.open = function (url, target, features) {
    console.log('overridden window.open()', url, target, features);

    const url_s = url ? url.toString() : '';
    if (url_s.startsWith('https://doc.qt.io')) {
      void vscode.post(CommandId.QtProfilerOpenUrl, { url: url_s });
      return null;
    }

    return originalOpen.call(window, url, target, features);
  };

  return () => {
    window.open = originalOpen;
  };
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

  console.log(performance.now(), line);

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

function setColorScheme(scheme: 'dark' | 'light') {
  const name = '(prefers-color-scheme:dark)';
  const original = window.matchMedia.bind(window);

  window.matchMedia = (q: string) => {
    const mql = original(q);
    if (q.replace(/\s/g, '') !== name) {
      return mql;
    }

    return new Proxy(mql, {
      get: (queries: MediaQueryList, prop) => {
        if (prop === 'matches') {
          return scheme === 'dark';
        }

        const v = Reflect.get(queries, prop);
        return ((typeof v === 'function') ? v.bind(queries) : v);
      }
    });
  };
}
