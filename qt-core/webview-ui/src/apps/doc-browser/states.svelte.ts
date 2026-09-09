// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type IndexData, type TocEntry } from '@shared/doc-browser';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel } from './types.svelte';

export type UiMode = 'toc' | 'search';

export const data = $state({
  toc: [] as TocEntry[],
  indexes: [] as IndexData[]
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'search' as UiMode,
  tocTree: new TocTreeModel(),

  selected: {
    toc: undefined as TocEntry | undefined,
    index: undefined as IndexData | undefined,
    html: ''
  }
});
