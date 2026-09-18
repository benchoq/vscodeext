<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import VirtualList from 'svelte-tiny-virtual-list';

  import { data } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

</script>

<div
  data-role='area'
  class='flex flex-col'
>
  <span class='p-2'>
    Total {data.indexes.length} entries
  </span>

  <div class='qt-item-list'>
    <VirtualList
      width="100%"
      height="100%"
      itemCount={data.indexes.length}
      itemSize={24}
    >
      {#snippet item({ style, index })}
        {@const entry = data.indexes[index]}
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
      {/snippet}
    </VirtualList>
  </div>
</div>

<style>
  [data-role='area'] {
    border: 1px solid #333333;
    height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
