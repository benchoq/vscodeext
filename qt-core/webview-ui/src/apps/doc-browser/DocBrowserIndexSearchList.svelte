<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';
</script>

<div
  data-role='area'
  class='flex flex-col'
>
  <span class='p-2'>
    Total {data.indexes.length} entries
  </span>
  <div class='qt-item-list flex flex-col h-full'>
    {#each data.indexes as entry, i (i + entry.filePathRel)}
      <button
        class='item flex align-start'
        class:active={viewlogic.isCurrentDoc(entry)}
        onclick={() => {
          viewlogic.openHtml(entry);
        }}
      >
        {entry.identifier}
      </button>
    {/each}
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
