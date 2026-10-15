// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

let _rootEl: HTMLElement | undefined = undefined;
let _canScrollToTop = $state(false);

export function canScrollToTop() {
  return _canScrollToTop;
}

export function getScrollTarget(el: HTMLElement | undefined) {
  if (!el) {
    return undefined;
  }

  const all = [el, ...el.querySelectorAll<HTMLElement>('*')];
  return all.find((el) => el.scrollHeight > el.clientHeight);
};

export function hookScroller(rootEl: HTMLElement) {
  _rootEl = rootEl;

  let disposed = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let cleanup: (() => void) | undefined;

  function attach() {
    if (disposed) {
      return;
    }

    const target = getScrollTarget(_rootEl);
    if (!target) {
      timeoutId = setTimeout(attach, 100);
      return;
    }

    const updateScrollButton = () => {
      _canScrollToTop = target.scrollTop > 200;
    };

    target.addEventListener('scroll', updateScrollButton);
    updateScrollButton();

    cleanup = () => {
      target.removeEventListener('scroll', updateScrollButton);
    };
  }

  requestAnimationFrame(attach);

  return () => {
    disposed = true;
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    cleanup?.();
  };
}

export function scrollToTop() {
  const scroller = getScrollTarget(_rootEl);
  if (!scroller) {
    return;
  }

  const duration = 150;
  const start = scroller.scrollTop;
  const startTime = performance.now();

  function animate(now: number) {
    if (!scroller) {
      return;
    }

    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;

    scroller.scrollTop = start * (1 - eased);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
