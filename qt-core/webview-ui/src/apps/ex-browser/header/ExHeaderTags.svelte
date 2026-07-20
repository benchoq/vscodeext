<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const count = $derived.by(() => {
    return (ui.filter.category?.tags.length ?? 0).toString();
  });
</script>

<button
  class='qt-push-button flex flex-row items-center gap-[6px] shrink-0'
  aria-expanded={ui.overlays.tagCloud.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={(e: MouseEvent) => {
    ui.overlays.tagCloud.refRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    viewlogic.setOverlayVisible('tagCloud', !ui.overlays.tagCloud.visible);
  }}
>
  <p class='tags-text'># Tags</p>
  <p class='qt-badge app-header-badge'>{count}</p>
</button>

<style>
  .tags-text {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-size-s);
  }
</style>
