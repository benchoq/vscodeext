// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export function portal(node: HTMLElement, target: HTMLElement | string = document.body) {
  let targetEl: HTMLElement;

  function resolveTarget(t: HTMLElement | string): HTMLElement {
    return typeof t === 'string'
      ? (document.querySelector(t) as HTMLElement)
      : t;
  }

  function mount(t: HTMLElement | string) {
    targetEl = resolveTarget(t);
    targetEl?.appendChild(node);
  }

  mount(target);

  return {
    update(newTarget: HTMLElement | string) {
      mount(newTarget);
    },
    destroy() {
      node.parentNode?.removeChild(node);
    }
  };
}
