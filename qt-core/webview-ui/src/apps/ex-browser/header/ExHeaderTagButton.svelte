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
  bind:this={ui.popovers.tags.refEl}
  class='qt-button inline-flex'
  aria-expanded={ui.popovers.tags.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={() => {
    viewlogic.setPopoverVisible('tags', !ui.popovers.tags.visible);
  }}
>
  <span data-hash>#</span>
  <span data-title>Tags</span>
  <span class='qt-counter-badge'>{count}</span>
</button>

<style>
  .qt-button {
    height: 28px;
    color: var(--qt-text-muted);
    text-overflow: unset;
    border-radius: var(--qt-radius-s);
  }
</style>
