// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type TocEntry,
  type IndexMatch,
} from '@shared/qt-help';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export const data = $state({
  toc: [] as TocEntry[],
  indexes: [] as IndexMatch[],
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'toc' as UiMode,
  tocTree: new TocTreeModel(),

  sidebar: {
    width: 300,
    min: 200,
    max: 650
  },

  index: {
    filter: { keyword: '' },
    filtered: [] as IndexMatch[]
  },
});
