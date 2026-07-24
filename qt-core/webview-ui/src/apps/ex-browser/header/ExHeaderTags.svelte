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
  bind:this={ui.overlays.tagCloud.refEl}
  class='
    ex-header-tags qt-button
    inline-flex
  '
  aria-expanded={ui.overlays.tagCloud.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={() => {
    viewlogic.setOverlayVisible('tagCloud', !ui.overlays.tagCloud.visible);
  }}
>
  <span data-hash>#</span>
  <span data-title>Tags</span>
  <span class='qt-counter-badge'>{count}</span>
</button>

<style lang='postcss'>
  .ex-header-tags {
    & > [data-hash] {
      font-size: 13px;
      line-height: 1;
      margin-bottom: 1px;
    }

    & > [data-title] {
      color: var(--qt-text-muted);
      font-size: 12px;
    }
  }
</style>
