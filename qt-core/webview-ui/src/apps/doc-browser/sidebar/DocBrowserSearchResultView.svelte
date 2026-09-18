<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { data, ui } from '../states.svelte';

  let inputEl: HTMLInputElement;

  onMount(() => {
    inputEl.focus();
    inputEl.select();
  })
</script>

<div
  data-role='area'
  class='flex flex-col'
>
  <div class='flex flex-row gap-1 p-0.5'>
    <span class='ml-1 items-center self-center'>
      Search
    </span>

    <input
      bind:this={inputEl}
      bind:value={ui.search.keyword}
      class='qt-input h-[26px] shrink-0 grow m-1 px-2'
      placeholder='Filter...'
      onfocus={() => {
        inputEl.select();
      }}
      oninput={() => {
        viewlogic.search(ui.search.keyword);
      }}
    />
  </div>

  <div class='qt-item-list flex flex-col h-full'>
    {#each data.fullText as entry, i (i)}
      <button
        class='item flex flex-col align-start'
        class:active={viewlogic.isCurrentDoc(entry.page)}
        onclick={() => {
          viewlogic.openHtml(entry.page);
        }}
      >
        <div>{entry.page.title}</div>
        <div class='opacity-50'>
          {entry.snippet}
        </div>
      </button>
    {/each}
  </div>

  <span class='p-2'>
    Total {data.fullText.length} entries
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
