// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  Star,
  Search,
  Clock4,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  SquareArrowOutUpRight
} from "@lucide/svelte";

import { ui } from '../states.svelte';
import * as helpers from '../helpers';
import * as viewlogic from '../viewlogic.svelte';

export type Action =
  | 'back' | 'forward'
  | 'findDialog' | 'toggleBookmark'
  | 'openInNewViewer' | 'bookmarkView' | 'historyView';

const icons: Record<Action, typeof ArrowLeft> = {
  back: ArrowLeft,
  forward: ArrowRight,
  findDialog: Search,
  toggleBookmark: Star,
  openInNewViewer: SquareArrowOutUpRight,
  bookmarkView: Bookmark,
  historyView: Clock4
};

const tooltips: Record<Action, string> = {
  back: 'Go back',
  forward: 'Go forward',
  findDialog: 'Find in page',
  openInNewViewer: 'Open in new viewer',
  toggleBookmark: 'Toggle bookmark',
  bookmarkView: 'Show bookmarks',
  historyView: 'Show history',
};

export function isEnabled(role: Action) {
  if (ui.iframe.errorCode) {
    return (role === 'bookmarkView' || role === 'historyView');
  }

  if (role === 'back' || role === 'forward') {
    return ui.history.canGo(role);
  }

  return true;
}

export function isChecked(role: Action) {
  switch (role) {
    case 'findDialog': return ui.popovers.find.visible;
    case 'bookmarkView': return ui.sidePanel.mode === 'bookmark';
    case 'historyView': return ui.sidePanel.mode === 'history';
    default:
      return false;
  }
}

export function findIcon(role: Action) {
  return icons[role];
}

export function tooltip(role: Action) {
  return tooltips[role];
}

export function onClicked(role: Action) {
  switch (role) {
    case 'back':
    case 'forward':
      viewlogic.navigate(role);
      break;

    case 'findDialog':
      ui.popovers.find.visible = !ui.popovers.find.visible;
      break;

    case 'openInNewViewer':
      viewlogic.openDoc(ui.iframe.uri, true);
      break;

    case 'toggleBookmark':
      viewlogic.bookmark.edit({
        action: 'toggle',
        entry: {
          uri: helpers.toFileUriIfServer(ui.iframe.uri),
          title: ui.iframe.title
        }
      })
      break;

    case 'bookmarkView':
      viewlogic.setSidePanel(
        (ui.sidePanel.mode !== 'bookmark') ? 'bookmark' : undefined
      );
      break;

    case 'historyView':
      viewlogic.setSidePanel(
        (ui.sidePanel.mode !== 'history') ? 'history' : undefined
      );break;

    default:
      break;
  }
}
