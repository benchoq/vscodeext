// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ArrowLeft, ArrowRight } from '@lucide/svelte';

import { ui } from './states.svelte';
import * as viewlogic from './viewlogic.svelte';

type ItemId = 'back' | 'forward' | 'openLink' | 'copy' | '_';

const texts: Record<ItemId, string> = {
  back: 'Back',
  forward: 'Forward',
  openLink: 'Open link in new tab',
  copy: 'Copy',
  _: ''
};

const icons: Record<ItemId, typeof ArrowLeft | undefined> = {
  back: ArrowLeft,
  forward: ArrowRight,
  openLink: undefined,
  copy: undefined,
  _: undefined,
};

export const orderedIds: ItemId[] = [
  'back',
  'forward',
  '_',
  'openLink',
  'copy'
];

export function onClicked(id: ItemId) {
  switch (id) {
    case 'back':
    case 'forward':
      viewlogic.navigate(id);
      break;

    case 'openLink':
      viewlogic.openDoc(ui.popovers.contextMenu.hoveredUri, 'new');
      return;

    case 'copy':
      viewlogic.copySelection();
      break;

    default:
      return;
  }
}

export function isEnabled(id: ItemId) {
  switch (id) {
    case 'back':
    case 'forward':
      return ui.history.canGo(id);

    case 'openLink':
      return ui.popovers.contextMenu.hoveredUri;

    case 'copy':
      return ui.popovers.contextMenu.hasSelection;

    default:
      return false;
  }
}

export function findText(id: ItemId) {
  return texts[id];
}

export function findIcon(id: ItemId) {
  return icons[id];
}
