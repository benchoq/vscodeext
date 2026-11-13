// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import type { TraceData, UiState, QtWasmInstance } from './types';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';

export const data = $state({
  trace: {
    fileName: '',
    filePath: '',
    bytes: new Uint8Array(),
  } as TraceData,

  profilerDistUri: ''
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  state: 'unknown' as UiState,
  containerEl: undefined as HTMLElement | undefined,
  wasmInstance: undefined as QtWasmInstance | undefined
});
