// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

const ScrollToTopDuration = 150;
const ScrollToTopThresholdPx = 200;

export function createVerticalScroller() {
  let targetEl: HTMLElement | undefined;
  let observer: MutationObserver | undefined;
  let animationId: number | undefined;
  let scrolledEnough = $state(false);

  function attach(rootEl: HTMLElement) {
    if (!prepareTarget(rootEl)) {
      observeTreeChanges(rootEl);
    }

    return {
      destroy() {
        cancelAnimation();
        stopObservingTree();
        targetEl?.removeEventListener('scroll', onTargetScrolled);
        targetEl = undefined;
        scrolledEnough = false;
      }
    }
  }

  function scrollToTop() {
    if (!targetEl) {
      return;
    }

    cancelAnimation();

    const el = targetEl;
    const initTop = targetEl.scrollTop;
    const initTime = performance.now();

    function animate(now: number) {
      const frame = calcAnimationFrame(now, initTop, initTime);
      el.scrollTop = frame.top;
      animationId = frame.finished ? undefined : requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
  }

  function onTargetScrolled() {
    scrolledEnough =
      (targetEl?.scrollTop ?? 0) > ScrollToTopThresholdPx;
  }

  function prepareTarget(rootEl: HTMLElement) {
    if (!targetEl) {
      targetEl = getScrollTarget(rootEl);
      targetEl?.addEventListener('scroll', onTargetScrolled);
      onTargetScrolled();
    }

    return !!targetEl;
  }

  function observeTreeChanges(rootEl: HTMLElement) {
    if (observer) {
      return;
    }

    observer = new MutationObserver(() => {
      if (prepareTarget(rootEl)) {
        stopObservingTree();
      }
    });

    observer.observe(rootEl, {
      subtree: true,
      childList: true
    });
  }

  function cancelAnimation() {
    if (animationId !== undefined) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
  }

  function stopObservingTree() {
    observer?.disconnect();
    observer = undefined;
  }

  return {
    get scrolledEnough() {
      return scrolledEnough;
    },

    attach,
    scrollToTop,
  }
}

// helpers
function getScrollTarget(el: HTMLElement | undefined) {
  const selector = 'div.virtual-list-wrapper';
  return el?.querySelector<HTMLDivElement>(selector) ?? undefined;
}

function calcAnimationFrame(
  now: number,
  initY: number,
  initTime: number,
) {
  const progress = Math.min((now - initTime) / ScrollToTopDuration, 1);
  const easedProgress = 1 - (1 - progress) ** 3;

  return {
    top: initY * (1 - easedProgress),
    finished: progress >= 1,
  };
}
