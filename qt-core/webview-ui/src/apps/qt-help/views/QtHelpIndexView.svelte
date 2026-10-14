<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount, type Snippet } from 'svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import QtHelpBaseView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { type IndexOrHeader } from '../types.svelte';

  const all = $derived(ui.index.modified);
  let virtualList: VirtualList;
  let virtualListHeight = $state(0);
  let inputEl = $state(undefined as HTMLInputElement | undefined);

  $effect(() => {
    void ui.index.filter.keyword;
    untrack(() => {
      virtualList.recomputeSizes?.(0);
    });
  })

  onMount(() => {
    inputEl?.focus();
    inputEl?.select();
  })
</script>

<QtHelpBaseView
  header={header as Snippet}
  content={content as Snippet}
  itemCount={all.length}
/>

{#snippet header()}
  <div class='flex flex-row w-full gap-2'>
    <span class='self-center'>Index</span>

    <QtHelpSearchInput
      bind:inputEl={inputEl}
      bind:value={ui.index.filter.keyword}
      placeholder='filter...'
      onSearch={() => {
        viewlogic.updateFilteredIndex();
      }}
    />
  </div>
{/snippet}

{#snippet content()}
  <div
    bind:clientHeight={virtualListHeight}
    class='qt-item-list w-full h-full'
  >
    <VirtualList
      bind:this={virtualList}
      height={virtualListHeight}
      scrollDirection='vertical'
      itemCount={all.length}
      itemSize={24}
    >
      {#snippet item({ style, index })}
        {@render _item(style, index)}
      {/snippet}
    </VirtualList>
  </div>
{/snippet}

{#snippet  _item(style: string, index: number)}
  {@const entry: IndexOrHeader = all[index]}
  {#if entry}
    <button
      {style}
      class='item w-full flex flex-row items-center'
      onclick={() => {
        if (entry.type !== 'section-header' && entry.data?.page) {
          viewlogic.openHtml(entry.data.page);
        }
      }}
    >
      <span
        data-role={entry.type}
        class='w-full h-full flex items-center'
      >
        {entry.display}
      </span>

      <span data-role='qt-module'>
        {entry.parsedTitle?.module ?? ''}
      </span>

    </button>
  {/if}
{/snippet}

<style>
  .qt-item-list {
    overflow: hidden;
  }

  .item {
    padding: 0px;
  }

  [data-role='item'],
  [data-role='section-item'],
  [data-role='section-header'] {
    @apply truncate;
    min-width: 0px;
    text-align: left;
    font-size: var(--qt-font-s);
    color: var(--qt-text-muted);
    padding: 3px 12px;
  }

  [data-role='section-item'] {
    margin-left: 20px;
    padding-left: 10px;
    border-left:
      1px solid
      color-mix(in srgb, var(--qt-text-muted) 20%, transparent);
  }

  [data-role='section-header'] {
    cursor: default;
  }

  [data-role='qt-module'] {
    padding: 0px 5px;
    color: var(--qt-text-muted);
    opacity: 0.5;
    font-size: var(--qt-font-xs);
  }
</style>
