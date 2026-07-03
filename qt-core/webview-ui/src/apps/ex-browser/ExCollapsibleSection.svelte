<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ChevronRight from '@/icons/ChevronRight.svelte';
  import { type ExCategory } from '@shared/ex-browser';
  import ExGridView from './ExGridView.svelte';
  import ExListView from './ExListView.svelte';
  import { data, ui } from './states.svelte';

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
    class='header'
    onclick={() => expanded = !expanded}
  >
    <div class={`header-chevron ${expanded ? 'rotate-0' : '-rotate-90'}`}>
      <ChevronRight />
    </div>
    <span class='header-text'>{category?.name ?? ''}</span>
    <span class="text-xs text-muted">{category?.count ?? 0}</span>
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
  :global(.header) {
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
  }

  :global(.header-chevron) {
    color: var(--qt-text-muted);
    transition: transform 150ms;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    transform: rotate(90deg);
  }

  :global(.header-text) {
    font-size: 11px;
    font-weight: 600;
    color: var(--qt-text-muted);
    flex: 1;
    text-align: start;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  :global(.header:hover .header-text) {
    color: var(--qt-text-default);
  }
</style>