// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type FullTextSearchData, type IndexData, type TocEntry } from '@shared/doc-browser';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export const data = $state({
  toc: [] as TocEntry[],
  indexes: [] as IndexData[],
  fullText: [] as FullTextSearchData[]
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'index' as UiMode,
  tocTree: new TocTreeModel(),
  iframeEl: undefined as HTMLIFrameElement | undefined,

  selected: {
    toc: undefined as TocEntry | undefined,
    index: undefined as IndexData | undefined,
    fullText: undefined as FullTextSearchData | undefined,
    htmlUri: ''
  }
});
