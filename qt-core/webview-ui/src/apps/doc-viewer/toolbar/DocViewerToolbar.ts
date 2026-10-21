// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  Dot,
  Star,
  Clock4,
  Columns2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Binoculars
} from "@lucide/svelte";

import { ui } from '../states.svelte';
import * as helpers from '../helpers';
import * as viewlogic from '../viewlogic.svelte';

export type Action =
  | 'back' | 'forward'
  | 'openInNewViewer' | 'toggleBookmark' | 'findDialog'
  | 'bookmarkView' | 'historyView';

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
  switch (role) {
    case 'back':
      return ui.history.canGo('back') ? ArrowLeft : Dot;

    case 'forward':
      return ui.history.canGo('forward') ? ArrowRight : Dot;

    case 'toggleBookmark':
      return Star;

  case 'openInNewViewer':
    return Columns2;

  case 'findDialog':
    return Binoculars;

  case 'bookmarkView':
    return Bookmark;

  case 'historyView':
    return Clock4;
  }
}

export function onClicked(role: Action) {
  switch (role) {
    case 'back':
    case 'forward':
      viewlogic.navigate(role);
      break;

    case 'openInNewViewer':
      viewlogic.openDoc(ui.iframe.uri, true);
      break;

    case 'toggleBookmark':
      viewlogic.bookmark.edit({
        action: 'toggle',
        entry: {
          uri: helpers.toFileUri(ui.iframe.uri),
          title: ui.iframe.title
        }
      })
      break;

    case 'findDialog':
      ui.popovers.find.visible = !ui.popovers.find.visible;
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
