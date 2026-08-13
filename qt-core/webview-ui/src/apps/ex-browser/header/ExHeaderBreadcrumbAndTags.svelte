<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Glyphs } from '@/icons';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const valid = $derived.by(() => {
    return (ui.selected.package?.name ?? '')
      && (ui.filter.category?.name ?? '')
      && (data.packages.length !== 0);
  });

  const catalog = $derived(ui.popovers.catalog);
  const catalogCount = $derived.by(() => {
    const count = ui.filter.category?.count ?? 0;
    const total = data.categories.find(c => c.type === 'all')?.count ?? 0;
    if (total === 0) {
      return '';
    }

    return (count === total) ? `${count} examples` : `${count} / ${total}`;
  });

  const tags = $derived(ui.popovers.tags);
  const tagsCount = $derived.by(() => {
    return (ui.filter.category?.tags.length ?? 0).toString();
  });
</script>

<!-- breadcrumb -->
<button
  bind:this={catalog.refEl}
  class='qt-button flex flex-row'
  aria-expanded={catalog.visible}
  disabled={data.packages.length === 0}
  onclick={() => {
    viewlogic.setPopoverVisible('catalog', !catalog.visible);
  }}
>
  {#if valid}
    <span data-role='title'>Categories</span>
    <span data-role='qt-version'>{ui.selected.package?.name ?? ''}</span>
    <span data-role='current-category'>{ui.filter.category?.name ?? ''}</span>
    <span class='qt-badge'>{catalogCount}</span>
    <span data-role='expand-arrow'>
      {Glyphs.triangleDown}
    </span>
  {:else}
    <span data-title>-</span>
  {/if}
</button>

<!-- tags -->
<button
  bind:this={tags.refEl}
  class='qt-button flex flex-row'
  aria-expanded={tags.visible}
  disabled={(ui.filter.category?.tags.length ?? 0) === 0}
  onclick={() => {
    viewlogic.setPopoverVisible('tags', !tags.visible);
  }}
>
  <span># Tags</span>
  <span class='qt-badge'>{tagsCount}</span>
</button>

<style>
  [data-role='current-category'] {
    color: var(--qt-text-default);
  }

  [data-role='expand-arrow'] {
    margin-left: 2px;
  }

  [data-role='qt-version']::before,
  [data-role='current-category']::before {
    content: '›';
    margin-right: 6px;
    opacity: 0.5;
  }

  .qt-button {
    height: 28px;
    color: var(--qt-text-muted);
    border-radius: var(--qt-radius-s);
    text-overflow: unset;

    &[aria-expanded='true'] {
      border-color: var(--qt-accent-info);
    }
  }
</style>
