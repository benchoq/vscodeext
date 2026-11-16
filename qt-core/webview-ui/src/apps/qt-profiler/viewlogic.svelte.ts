// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { CommandId } from '@shared/message';
import { type ThemeInfo } from '@/comps/VscodeThemeMonitor.svelte';

import { data, ui } from './states.svelte';
import { loadProfiler, log } from './viewlogic.profiler.svelte';
import { type RpcOutput, type UiState } from "./types";

export async function onAppMount() {
  if (!ui.containerEl) {
    log('Invalid UI container for WASM application');
    return;
  }

  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onThemeChanged);
  overrideWindowApis();
  setUiState('triggered');

  await loadConfig();
  await loadTrace();
  await loadProfiler(data.trace, {
    distUri: data.config.profilerDistUri,
    containerEl: ui.containerEl,
    onRpcMessage,
  });
}

// helpers
async function loadConfig() {
  const r = await vscode.post(CommandId.QtProfilerGetConfig);
  data.config.profilerDistUri = _.get(r, 'profilerDistUri', '');
}

async function loadTrace() {
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

  log('QML trace loaded', {
    ...traceInfo,
    length: bytes.length,
    took: (performance.now() - start)
  });
}

function onRpcMessage(msg: RpcOutput) {
 switch (msg.method) {
    case 'traceFileLoadingStarted':
      setUiState('loading');
      break;

    case 'traceFileLoadingFinished':
      setUiState('loaded');
      break;

    case 'traceEventSelected': {
      void vscode.post(CommandId.QtProfilerEventSelected, msg.params);
      break;
    }
  }
}

function onThemeChanged(prev: ThemeInfo, current: ThemeInfo) {
  if (prev.dark !== current.dark) {
    void vscode.post(CommandId.QtProfilerReloadWebviewHtml);
  }
}

const originalWindowOpen = window.open;
const originalMatchMedia = window.matchMedia.bind(window);

function overrideWindowApis() {
  window.matchMedia = (q: string) => {
    const mql = originalMatchMedia(q);
    if (q.replace(/\s/g, '') !== '(prefers-color-scheme:dark)') {
      return mql;
    }

    return new Proxy(mql, {
      get: (queries: MediaQueryList, prop) => {
        if (prop === 'matches') {
          return ui.theme.states.dark;
        }

        const v = Reflect.get(queries, prop);
        return ((typeof v === 'function') ? v.bind(queries) : v);
      }
    });
  };

  window.open = function (urlToOpen, target, features) {
    const url = urlToOpen ? urlToOpen.toString() : '';
    if (url.startsWith('https://doc.qt.io')) {
      void vscode.post(CommandId.QtProfilerOpenUrl, { url });
      return null;
    }

    return originalWindowOpen.call(window, urlToOpen, target, features);
  };
}

function setUiState(s: UiState) {
  if (ui.state === s) {
    return;
  }

  switch (s) {
    case 'triggered':
      if (ui.containerEl) {
        // workaround for the profiler width not being set on first load
        ui.containerEl.style.width = 'calc(100% - 1px)';
      }
      break;

    case 'loaded':
      if (ui.containerEl) {
        ui.containerEl.style.width = '100%';
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
      break;

    default:
      break;
  }

  ui.state = s;
}
