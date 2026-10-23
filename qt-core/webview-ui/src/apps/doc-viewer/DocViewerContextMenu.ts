// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ArrowLeft } from '@lucide/svelte';

import { ui } from './states.svelte';
import * as viewlogic from './viewlogic.svelte';

export const items = [
  { id: 'back', label: 'Back', icon: ArrowLeft },
  { id: 'forward', label: 'Forward' },
  { id: '' },
  { id: 'copy', label: 'Copy'}
]

export function onClicked(id: string) {
  switch (id) {
    case 'back':
    case 'forward':
      viewlogic.navigate(id);
      break;

    case 'copy':
      viewlogic.copySelection();
      break;

    default:
      return;
  }
}

export function isEnabled(id: string) {
  switch (id) {
    case 'back':
    case 'forward':
      return ui.history.canGo(id);

    case 'copy':
      return true;

    default:
      return false;
  }
}
