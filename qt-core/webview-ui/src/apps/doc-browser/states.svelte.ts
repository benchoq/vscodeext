// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type TocEntry,
  type IndexMatch,
  type FullTextMatch,
} from '@shared/doc-browser';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel, HistoryManager } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export const data = $state({
  toc: [] as TocEntry[],
  indexes: [] as IndexMatch[],
  fullText: [] as FullTextMatch[],
  configs: {
    serverOrigin: '' // expects 'http://127.0.0.1:<port>'
  }
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'toc' as UiMode,
  tocTree: new TocTreeModel(),
  iframeEl: undefined as HTMLIFrameElement | undefined,
  sidebar: {
    width: 300,
    min: 200,
    max: 650
  },

  selected: {
    htmlUri: '',
  },

  index: {
    filter: { keyword: '' },
    filtered: [] as IndexMatch[]
  },

  search: {
    keyword: ''
  },

  history: new HistoryManager()
});
