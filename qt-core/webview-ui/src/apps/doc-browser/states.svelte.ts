// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type HtmlPageInfo,
  type TocEntry,
  type IndexMatch,
  type FullTextMatch
} from '@shared/doc-browser';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel, HistoryManager } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export const data = $state({
  toc: [] as TocEntry[],
  indexes: [] as IndexMatch[],
  fullText: [] as FullTextMatch[]
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'index' as UiMode,
  tocTree: new TocTreeModel(),
  iframeEl: undefined as HTMLIFrameElement | undefined,

  selected: {
    htmlUri: '',
    htmlEntry: undefined as HtmlPageInfo | undefined
  },

  history: new HistoryManager()
});
