// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type TocEntry,
  type IndexMatch,
  type FullTextMatch,
  type QtDocRootInfo,
} from '@shared/qt-help';
import { TaskBusyRunner } from '@/comps/TaskBusyRunner.svelte';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel, type IndexOrHeader } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export const data = $state({
  packages: [] as QtDocRootInfo[],

  toc: [] as TocEntry[],
  indexes: [] as IndexMatch[],
  search: {
    keyword: '',
    result: [] as FullTextMatch[]
  }
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  mode: 'toc' as UiMode,
  home: '',
  tocTree: new TocTreeModel(),
  task: new TaskBusyRunner(),
  selected: {
    package: undefined as QtDocRootInfo | undefined,
  },

  sidebar: {
    width: 350,
    min: 200,
    max: 600
  },

  search: {
    keyword: ''
  },

  index: {
    filter: { keyword: '' },
    filtered: [] as IndexOrHeader[],
    modified: [] as IndexOrHeader[]
  },

  popovers: {
    qtVersions: {
      visible: false,
      refEl: undefined as HTMLButtonElement | undefined,
    }
  }
});
