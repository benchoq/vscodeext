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
  bind:this={ui.popovers.catalog.refEl}
  class='qt-button'
  aria-expanded={ui.popovers.catalog.visible}
  disabled={data.packages.length === 0}
  onclick={() => {
    viewlogic.setPopoverVisible('catalog', !ui.popovers.catalog.visible);
  }}
>
  {#if valid}
    <span data-title>Categories</span>
    <span data-version>{ui.selected.package?.name ?? ''}</span>
    <span data-category>{ui.filter.category?.name ?? ''}</span>
    <span class='qt-counter-badge'>{countText}</span>
    <span data-arrow>{chars.downArrow}</span>
  {:else}
    <span data-title>-</span>
  {/if}
</button>

<style>
  .qt-button {
    height: 28px;
    color: var(--qt-text-muted);
    text-overflow: unset;
    border-radius: var(--qt-radius-s);

    & > [data-title] {
      font-weight: 600;
    }

    & > [data-category] {
      color: var(--qt-text-default);
      font-weight: 500;
    }

    & > [data-arrow] {
      font-size: 9px;
      margin-left: 2px;
    }

    & > [data-version]::before,
    & > [data-category]::before {
      content: '›';
      margin-right: 6px;
      font-size: 11px;
      opacity: 0.5;
    }
  }
</style>
