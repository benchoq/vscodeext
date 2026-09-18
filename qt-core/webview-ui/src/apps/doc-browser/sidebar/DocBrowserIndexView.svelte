<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount } from 'svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(ui.index.filtered);
  let virtualList: VirtualList;
  let filterInput: HTMLInputElement;

  $effect(() => {
    void ui.index.filter.keyword;
    untrack(() => {
      virtualList.recomputeSizes?.(0);
    });
  })

  onMount(() => {
    filterInput.focus();
    filterInput.select();
  })
</script>

<div
  data-role='area'
  class='flex flex-col gap-1'
>
  <div class='flex flex-row gap-1 p-0.5'>
    <span class='ml-1 items-center self-center'>
      Index
    </span>

    <input
      bind:this={filterInput}
      bind:value={ui.index.filter.keyword}
      class='qt-input h-[26px] shrink-0 grow m-1 px-2'
      placeholder='Filter...'
      oninput={() => {
        viewlogic.updateFilteredIndex();
      }}
    />
  </div>

  <div class='qt-item-list'>
    <VirtualList
      bind:this={virtualList}
      width="100%"
      height="100%"
      itemCount={all.length}
      itemSize={24}
    >
      {#snippet item({ style, index })}
      {@const entry = all[index]}
      {#if entry}
        <button
          {style}
          class='item flex items-center'
          class:active={viewlogic.isCurrentDoc(entry.page)}
          onclick={() => {
            viewlogic.openHtml(entry.page);
          }}
        >
          <span class='truncate min-w-0'>
            {entry.name}
          </span>
        </button>
      {/if}
      {/snippet}
    </VirtualList>
  </div>

  <div class='grow'></div>
  <span class='p-2'>
    Total {all.length} entries
  </span>
</div>

<style>
  [data-role='area'] {
    height: 100%;
    min-height: 0;
    overflow: auto;
    border: 1px solid #444;
  }
</style>
