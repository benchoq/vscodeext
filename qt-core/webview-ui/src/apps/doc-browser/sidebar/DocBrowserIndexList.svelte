<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack } from 'svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(ui.index.filtered);
  let virtualList: VirtualList;

  $effect(() => {
    void ui.index.filter.keyword;
    untrack(() => {
      virtualList.recomputeSizes?.(0);
    });
  })
</script>

<div
  data-role='area'
  class='flex flex-col'
>
  <input
    bind:value={ui.index.filter.keyword}
    class='qt-input h-[26px] shrink-0 m-1 px-2'
    placeholder='Filter...'
    oninput={() => {
      viewlogic.updateFilteredIndex();
    }}
  />

  <div class='qt-item-list grow'>
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
            {entry.identifier}
          </span>
        </button>
      {/if}
      {/snippet}
    </VirtualList>
  </div>

  <span class='p-2'>
    Total {all.length} entries
  </span>
</div>

<style>
  [data-role='area'] {
    border: 1px solid #333333;
    height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
