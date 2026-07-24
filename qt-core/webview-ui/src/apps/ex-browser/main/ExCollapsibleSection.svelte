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
      <ChevronRight />
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
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 0;
    margin-bottom: 10px;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid var(--qt-stroke-subtle);
    position: sticky;
    top: 0;
    background: var(--qt-bg-default);
    z-index: 10;

    & > [data-chevron] {
      color: var(--qt-text-muted);
      transition: transform 150ms;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
    }

    & > [data-text] {
      flex: 1;
      font-size: 11px;
      font-weight: 600;
      color: var(--qt-text-muted);
      text-align: start;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    &:hover [data-text] {
      color: var(--qt-text-default);
    }

    & > [data-count] {
      font-size: 10px;
      color: var(--qt-text-muted);
      font-variant-numeric: tabular-nums;
    }
  }
</style>