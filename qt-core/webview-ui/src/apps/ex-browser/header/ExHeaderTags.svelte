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
  class='ex-header-tags inline-flex'
  aria-expanded={ui.overlays.tagCloud.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={() => {
    viewlogic.setOverlayVisible('tagCloud', !ui.overlays.tagCloud.visible);
  }}
>
  <span data-hash>#</span>
  <span data-title>Tags</span>
  <span data-count>{count}</span>
</button>

<style lang='postcss'>
  @reference "../app.css";

  .ex-header-tags {
    @apply ex-browser-push-button;

    /* TODO: simplify */
    padding: 0 9px;
    font-size: 11px;
    font-weight: 500;
    gap: 5px;
    transition: border-color 80ms, color 80ms;

    & > [data-hash] {
      font-size: 13px;
      line-height: 1;
      margin-bottom: 1px;
    }

    & > [data-title] {
      color: var(--qt-text-muted);
      font-size: 12px;
    }

    & > [data-count] {
      @apply ex-browser-counter-badge;
      padding: 0 4px; /* TODO: simplify */
    }
  }

</style>
