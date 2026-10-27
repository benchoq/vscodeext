// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  type TocEntry,
  type IndexMatch,
  type FullTextMatch,
  type QtDocRootInfo,
} from '@shared/qt-help';
  import VirtualList from 'svelte-tiny-virtual-list';
import { TaskBusyRunner } from '@/comps/TaskBusyRunner.svelte';
import { createPopoverController } from '@/comps/Popover.logic.svelte';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { TocTreeModel, type IndexOrHeader } from './types.svelte';

export type UiMode = 'toc' | 'index' | 'text';

export interface IndexSectionInfo {
  name: string;
  index: number;
};

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
    modified: [] as IndexOrHeader[],
    sectionJump: [] as IndexSectionInfo[],

    list: {
      comp: undefined as VirtualList | undefined,
      height: 0,
      itemHeight: 24,
      startItem: undefined as IndexOrHeader | undefined,
      startIndex: 0,
      scrollOffset: 0
    }
  },

  popovers: {
    qtVersions: createPopoverController(),
    indexSelector: createPopoverController()
  }
});
