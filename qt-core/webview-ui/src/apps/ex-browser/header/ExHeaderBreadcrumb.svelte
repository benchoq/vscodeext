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
  class='ex-browser-push-button ex-header-breadcrumb flex flex-row'
  aria-expanded={ui.overlays.catalog.visible}
  disabled={data.packages.length === 0}
  onclick={() => {
    viewlogic.setOverlayVisible('catalog', !ui.overlays.catalog.visible);
  }}
>
  <p class='title'>
    {valid ? 'Categories' : '-'}
  </p>

  {#if valid}
    <p class='icons opacity-50'>{chars.rightChevron}</p>
    <p class='version'>{ui.selected.package?.name ?? ''}</p>
    <p class='icons opacity-50'>{chars.rightChevron}</p>
    <p class='category'>{ui.filter.category?.name ?? ''}</p>
    <p class='ex-browser-badge'>{countText}</p>
    <p class='icons'>{chars.downArrow}</p>
  {/if}
</button>

<style>
  .ex-header-breadcrumb {
    & .title {
      color: var(--qt-text-muted);
      font-weight: var(--qt-font-weight-bold);
    }

    & .version {
      color: var(--qt-text-muted);
      font-size: var(--qt-font-size-s);
    }

    & .category {
      color: var(--qt-text-default);
      font-weight: var(--qt-font-weight-active);
    }

    & .icons {
      color: var(--qt-text-muted);
      font-size: var(--qt-font-size-xs);
    }
  }
</style>
