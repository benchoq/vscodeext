<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const charDownArrow = '▾';
  const charRightChevron = '›';

  const valid = $derived.by(() => {
    return (ui.selected.package?.name ?? '')
      && (ui.filter.category?.name ?? '')
      && (data.packages.length !== 0);
  });

  const countText = $derived.by(() => {
    const count = ui.filter.category?.count ?? 0;
    const total = data.categories.find(c => c.type === 'all')?.count ?? 0;
    if (total === 0) {
      return '';
    }

    return (count === total)
      ? `${count} examples`
      : `${count} / ${total}`
  });
</script>

<button
  bind:this={ui.overlays.catalog.refEl}
  class='qt-push-button flex flex-row'
  aria-expanded={ui.overlays.catalog.visible}
  disabled={data.packages.length === 0}
  onclick={() => {
    viewlogic.setOverlayVisible('catalog', !ui.overlays.catalog.visible);
  }}
>
  {#if valid}
    <p class='breadcrumb-title'>Categories</p>
    <p class='breadcrumb-chevron-right'>{charRightChevron}</p>
    <p class='breadcrumb-version'>{ui.selected.package?.name ?? ''}</p>
    <p class='breadcrumb-chevron-right'>{charRightChevron}</p>
    <p class='breadcrumb-category'>{ui.filter.category?.name ?? ''}</p>
    <p class='qt-badge app-header-badge'>{countText}</p>
    <p class='breadcrumb-down-arrow'>{charDownArrow}</p>
  {:else}
    <p class='breadcrumb-title'>-</p>
  {/if}
</button>

<style>
  .breadcrumb-title {
    color: var(--qt-text-muted);
    font-weight: var(--qt-font-weight-bold);
  }

  .breadcrumb-version {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-size-s);
  }

  .breadcrumb-category {
    color: var(--qt-text-default);
    font-weight: var(--qt-font-weight-active);
  }

  .breadcrumb-chevron-right {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-size-xs);
    opacity: 0.5;
  }

  .breadcrumb-down-arrow {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-size-xs);
  }
</style>
