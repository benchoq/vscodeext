// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import type { TraceData, UiState } from './types';

export const data = $state({
  trace: {
    fileName: '',
    filePath: '',
    bytes: new Uint8Array(),
  } as TraceData,

  profilerDistUri: ''
});

export const ui = $state({
  state: 'unknown' as UiState,
  containerEl: undefined as HTMLElement | undefined,
});
