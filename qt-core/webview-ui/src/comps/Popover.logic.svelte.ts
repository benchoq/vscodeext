// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export function createPopoverController() {
  let _visible = $state(false);
  let _refEl = $state<HTMLElement>();

  return {
    get visible() { return _visible; },
    get refEl() { return _refEl; },
    set refEl(el) { _refEl = el; },

    show: () => { _visible = true; },
    hide: () => { _visible = false; },
    toggle: () => { _visible = !_visible; }
  };
}

export function createPopoverControllerWith<T extends object>(extra?: T) {
  const c = createPopoverController();
  type PopoverControllerWithExtra = typeof c & T;

  if (!extra) {
    return c as PopoverControllerWithExtra;
  }

  return Object.defineProperties(
    c,
    Object.getOwnPropertyDescriptors(extra)
  ) as PopoverControllerWithExtra;
}

export type PopoverController = ReturnType<typeof createPopoverController>;
