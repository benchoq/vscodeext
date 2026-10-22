// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  Star,
  Search,
  Clock4,
  Bookmark,
  ArrowLeft,
  FolderOpen,
  ArrowRight,
  SquareArrowOutUpRight,
} from "@lucide/svelte";

import { ui } from '../states.svelte';
import * as helpers from '../helpers';
import * as viewlogic from '../viewlogic.svelte';

export type Action =
  | 'back' | 'forward'
  | 'showFindInPage' | 'toggleBookmark'
  | 'openInNewViewer' | 'openInFileManager'
  | 'bookmarkView' | 'historyView';

const icons: Record<Action, typeof ArrowLeft> = {
  back: ArrowLeft,
  forward: ArrowRight,
  showFindInPage: Search,
  toggleBookmark: Star,
  openInNewViewer: SquareArrowOutUpRight,
  openInFileManager: FolderOpen,
  bookmarkView: Bookmark,
  historyView: Clock4
};

const tooltips: Record<Action, string> = {
  back: 'Go back',
  forward: 'Go forward',
  showFindInPage: 'Find in page',
  openInNewViewer: 'Open in new viewer',
  openInFileManager: 'Open in file manager',
  toggleBookmark: 'Toggle bookmark',
  bookmarkView: 'Show bookmarks',
  historyView: 'Show history',
};

export function isEnabled(role: Action) {
  const empty = ui.iframe.uri.length === 0;
  const error = ui.iframe.errorCode.length !== 0;

  switch (role) {
    case 'back':
    case 'forward':
      return !error && ui.history.canGo(role);

      case 'showFindInPage':
      case 'toggleBookmark':
      case 'openInNewViewer':
      case 'openInFileManager':
      return !error && !empty;

    case 'bookmarkView':
    case 'historyView':
      return true;

    default:
      return false;
  }
}

export function isChecked(role: Action) {
  switch (role) {
    case 'showFindInPage': return ui.popovers.find.visible;
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

    case 'showFindInPage':
      ui.popovers.find.visible = !ui.popovers.find.visible;
      break;

    case 'openInNewViewer':
      viewlogic.openDoc(ui.iframe.uri, 'new');
      break;

    case 'openInFileManager':
      viewlogic.openDoc(ui.iframe.uri, 'file-manager');
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
