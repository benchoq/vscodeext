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
    Total {data.fullText.length} entries
  </span>
  <div class='qt-item-list flex flex-col h-full'>
    {#each data.fullText as entry, i (i)}
      <button
        class='item flex flex-col align-start'
        class:active={viewlogic.isCurrentDoc(entry)}
        onclick={() => {
          viewlogic.openHtml(entry);
        }}
      >
        <div>{entry.title}</div>
        <div class='opacity-50'>
          {entry.snippet}
        </div>
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
