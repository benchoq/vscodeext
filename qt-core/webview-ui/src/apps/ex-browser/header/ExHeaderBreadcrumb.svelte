<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as chars from '@/utils/chars';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

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
  class='ex-header-breadcrumb inline-flex'
  aria-expanded={ui.overlays.catalog.visible}
  disabled={data.packages.length === 0}
  onclick={() => {
    viewlogic.setOverlayVisible('catalog', !ui.overlays.catalog.visible);
  }}
>
  {#if valid}
    <span data-title>Categories</span>
    <span data-version>{ui.selected.package?.name ?? ''}</span>
    <span data-category>{ui.filter.category?.name ?? ''}</span>
    <span data-count>{countText}</span>
    <span data-arrow>{chars.downArrow}</span>
  {:else}
    <span data-title>-</span>
  {/if}
</button>

<style lang='postcss'>
  @reference "../app.css";

  .ex-header-breadcrumb {
    @apply ex-browser-push-button;

    & > [data-title] {
      color: var(--qt-text-muted);
      font-size: 12px;
      font-weight: 600;
    }

    & > [data-version] {
      color: var(--qt-text-muted);
      font-size: 12px;
    }

    & > [data-category] {
      color: var(--qt-text-default);
      font-size: 12px;
      font-weight: 500;
    }

    & > [data-count] {
      @apply ex-browser-counter-badge;
    }

    & > [data-arrow] {
      color: var(--qt-text-muted);
      font-size: 9px;
      margin-left: 2px;
    }

    & > [data-version]::before,
    & > [data-category]::before {
      content: '›';
      margin-right: 6px;
      color: var(--qt-text-muted);
      font-size: 11px;
      opacity: 0.5;
    }
  }
</style>
