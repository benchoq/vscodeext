<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';

  let dragging = $state(false);

  function startResize(event: PointerEvent) {
    const el = event.currentTarget as HTMLElement;
    const startX = event.clientX;
    const startWidth = ui.sidebar.width;

    dragging = true;
    el.setPointerCapture(event.pointerId);

    const move = (event: PointerEvent) => {
      const candidate = startWidth + event.clientX - startX;
      ui.sidebar.width = Math.min(
        ui.sidebar.max,
        Math.max(ui.sidebar.min, candidate)
      );
    };

    const end = () => {
      dragging = false;
      el.releasePointerCapture(event.pointerId);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointercancel', end);
    };

    el.addEventListener('pointerup', end);
    el.addEventListener('pointermove', move);
    el.removeEventListener('pointercancel', end);
  }
</script>

<div
  data-resize-handle
  class:dragging
  onpointerdown={startResize}
  role='button'
  tabindex='0'
>
</div>

<style>
  [data-resize-handle] {
    width: 4px;
    flex-shrink: 0;
    cursor: col-resize;

    &:hover,
    &.dragging {
      background: var(--vscode-focusBorder);
    }
  }
</style>
