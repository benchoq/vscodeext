// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export function portal(node: HTMLElement, target: HTMLElement | string = 'body') {
  let targetEl: HTMLElement;

  function resolveTarget(target: HTMLElement | string): HTMLElement {
    if (typeof target === 'string') {
      const el = document.querySelector<HTMLElement>(target);

      if (!el) {
          throw new Error(`Portal target not found: ${target}`);
      }

      return el;
    }

    return target;
  }

  function move(target: HTMLElement | string) {
    const el = resolveTarget(target);

    if (el !== targetEl) {
        targetEl = el;
        targetEl.appendChild(node);
    }
  }

  move(target);

  return {
      update: move,
      destroy() {
          node.remove();
      }
  };
}

export function clickOutside(el: HTMLElement, cb: (ev: MouseEvent) => void) {
  function onclick(ev: MouseEvent) {
    const target = ev.target;
    if (el && target instanceof Node && !el.contains(target)) {
      cb(ev);
    }
  }

  document.addEventListener('click', onclick, true);

  return {
    destroy() {
      document.removeEventListener('click', onclick, true);
    }
  };
}

export function placeNear(target: HTMLElement, ref: HTMLElement | undefined) {
  const rr = ref?.getBoundingClientRect();
  const tr = target.getBoundingClientRect();

  if (rr) {
    target.style.top = `${rr.bottom + 3}px`;
    target.style.left = `${rr.right - tr.width}px`;
  }
}
