// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import type { Coords } from '@floating-ui/dom';

import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import { type BookmarkEntry } from '@shared/qt-browser';
import { HistoryManager } from './types.svelte';

export interface BookmarkItem {
  data: BookmarkEntry;
  checked: boolean
}

export const data = $state({
  bookmarks: [] as BookmarkItem[],
  configs: {
    homeUri: '',
    serverOrigin: '' // expects 'http://127.0.0.1:<port>'
  }
});

export const ui = $state({
  iframe: {
    el: undefined as HTMLIFrameElement | undefined,
    src: '',
    title: '',
    hoveredUri: '',
  },

  theme: VscodeThemeMonitor.createController(),

  popovers: {
    find: {
      keyword: '',
      visible: false,
      refEl: undefined as HTMLButtonElement | undefined,
    },

    contextMenu: {
      pos: undefined as Coords | undefined,
      visible: false,
    }
  },

  layers: {
    bookmark: false
  },

  history: new HistoryManager()
});
