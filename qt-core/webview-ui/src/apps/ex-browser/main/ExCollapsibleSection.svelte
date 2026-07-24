<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ChevronRight from '@/icons/ChevronRight.svelte';
  import { type ExCategory } from '@shared/ex-browser';
  import ExGridView from './ExGridView.svelte';
  import ExListView from './ExListView.svelte';
  import { data, ui } from '../states.svelte';

  let {
    category = undefined as ExCategory | undefined,
    expanded = $bindable(true)
  } = $props();

  const examples = $derived.by(() => {
    switch (category?.type) {
      case 'featured':
        return data.examples.filter((ex) => ex.highlighted);

      case 'general': {
        const name = category?.name.trim() ?? '';
        return data.examples.filter((ex) => ex.categories.includes(name));
      }

      case 'all':
        return data.examples;

      default:
        return [];
    }
  });
</script>

<div class="flex flex-col">
  <button
    data-comp-header
    class='flex flex-row'
    onclick={() => {
      expanded = !expanded;
    }}
  >
    <div
      data-chevron
      style:transform={expanded ? 'rotate(90deg)' : 'rotate(0deg)'}
    >
      <ChevronRight size={16} />
    </div>
    <span data-text>{category?.name ?? ''}</span>
    <span data-count>{examples.length}</span>
  </button>

  {#if expanded}
    {#if ui.selected.viewMode === 'grid'}
      <ExGridView {examples} />
    {:else}
      <ExListView {examples} />
    {/if}
  {/if}
</div>

<style>
  [data-comp-header] {
    top: 0;
    position: sticky;
    z-index: 10;
    padding: 5px 0;
    margin-top: 6px;
    margin-bottom: 10px;

    color: var(--qt-text-muted);
    background: var(--qt-bg-default);
    border-bottom: 1px solid var(--qt-stroke-subtle);

    gap: 7px;
    align-items: center;
    user-select: none;
    cursor: pointer;

    & > [data-chevron] {
      transition: transform 150ms;
    }

    & > [data-text] {
      flex: 1;
      font-size: 11px;
      font-weight: 600;
      text-align: start;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    &:hover [data-text] {
      color: var(--qt-text-default);
    }

    & > [data-count] {
      font-size: 10px;
      font-variant-numeric: tabular-nums;
    }
  }
</style>
