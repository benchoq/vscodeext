<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount, type Snippet } from 'svelte';
  import { Dot as Bullet } from '@lucide/svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import QtHelpBaseView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(ui.index.filtered);
  let virtualList: VirtualList;
  let virtualListHeight = $state(0);
  let inputEl = $state(undefined as HTMLInputElement | undefined);

  type ItemType = 'unique' | 'duplicated-start' | 'duplicated' | 'duplicated-end';

  function findItemType(index: number): ItemType {
    const prev = all[index - 1];
    const current = all[index];
    const next = all[index + 1];

    const samePrev = prev?.name === current.name;
    const sameNext = next?.name === current.name;

    if (samePrev && sameNext) return 'duplicated';
    if (samePrev) return 'duplicated-end';
    if (sameNext) return 'duplicated-start';
    return 'unique';
  }

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
  {@const entry = all[index]}
  {@const entryType = findItemType(index)}
  {#if entry}
    <!-- {#if entryType === 'duplicated-start'}
      <span>{entry.name}</span>
    {/if} -->

    <button
      {style}
      class='item flex items-center'
      // class:active={viewlogic.isCurrentDoc(entry.page)}
      onclick={() => {
        viewlogic.openHtml(entry.page);
      }}
    >
      {#if entryType.startsWith('duplicated')}
        <Bullet class='shrink-0' />
        <span data-role='title'>
          {entry.page.title}
        </span>
      {:else}
        {entry.name}
      {/if}
    </button>
  {/if}
{/snippet}

<style>
  [data-role='title'] {
    min-width: 0px;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--qt-font-s);
    color: var(--qt-text-muted);
  }

  .qt-item-list {
    overflow: hidden;
  }

</style>
