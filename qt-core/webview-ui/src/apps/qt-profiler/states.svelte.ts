// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export type ProfilerState =  'unknown' | 'triggered' | 'loading' | 'loaded';

export const data = $state({
  bytes: new Uint8Array(),
  configs: {
    qtProfiler: {
      distDir: '' // output from asWebviewUri()
    },

    fileName: '',
    filePath: '',
  }
})

export const ui = $state({
  container: undefined as HTMLElement | undefined,
  profiler: {
    state: 'unknown' as ProfilerState
  }
})
