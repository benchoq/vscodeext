// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type Coords } from '@floating-ui/dom';
import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';
import {
  HistoryManager,
  type HistoryItemGroup,
  type HistoryItem,
  type BookmarkItem,
} from './types.svelte';

export const data = $state({
  bookmarks: [] as BookmarkItem[],
  history: {
    raw: [] as HistoryItem[],
    groups: [] as HistoryItemGroup[]
  },
  configs: {
    homeUri: '',
    serverOrigin: '' // expects 'http://127.0.0.1:<port>'
  }
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController(),
  history: new HistoryManager(),

  iframe: {
    el: undefined as HTMLIFrameElement | undefined,
    uri: '', // http://127.0.0.1:<port>/.../...html#anchor

    // load state
    title: '',
    filePath: '',
    errorCode: '',

    // ui state
    scrollTop: 0,
    hoveredUri: '',
  },

  sidePanel: {
    min: 200,
    max: 600,
    width: 350,
    mode: undefined as 'bookmark' | 'history' | undefined
  },

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
  }
});
