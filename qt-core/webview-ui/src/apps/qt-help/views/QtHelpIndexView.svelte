<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount, type Snippet } from 'svelte';
  import { Dot as Bullet } from '@lucide/svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import QtHelpBaseView from './QtHelpBaseView.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(ui.index.filtered);
  let virtualList: VirtualList;
  let inputEl: HTMLInputElement;

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
    inputEl.focus();
    inputEl.select();
  })
</script>

<QtHelpBaseView
  header={header as Snippet}
  content={content as Snippet}
  itemCount={all.length}
/>

{#snippet header()}
  <span class='ml-1 items-center self-center'>
    Index
  </span>

  <input
    bind:this={inputEl}
    bind:value={ui.index.filter.keyword}
    class='qt-input h-[26px] shrink-0 grow m-1 px-2'
    placeholder='filter...'
    oninput={() => {
      viewlogic.updateFilteredIndex();
    }}
  />
{/snippet}

{#snippet content()}
  <div class='qt-item-list'>
    <VirtualList
      bind:this={virtualList}
      width='100%'
      height="100%"
      itemCount={all.length}
      itemSize={24}
    >
      {#snippet item({ style, index })}
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
    </VirtualList>
  </div>
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
</style>
