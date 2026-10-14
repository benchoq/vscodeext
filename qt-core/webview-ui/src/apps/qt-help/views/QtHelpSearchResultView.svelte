<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  import QtHelpView from './QtHelpBaseView.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let inputEl: HTMLInputElement;

  onMount(() => {
    inputEl.focus();
    inputEl.select();
  })
</script>

<QtHelpView
  header={header as Snippet}
  content={content as Snippet}
  itemCount={data.fullText.length}
/>

<!-- snippets -->
{#snippet header()}
  <span class='ml-1 items-center self-center'>
    Search
  </span>

  <input
    bind:this={inputEl}
    bind:value={ui.search.keyword}
    class='qt-input h-[26px] shrink-0 grow m-1 px-2'
    placeholder='keyword...'
    onfocus={() => {
      inputEl.select();
    }}
    oninput={() => {
      viewlogic.search(ui.search.keyword);
    }}
  />
{/snippet}

{#snippet content()}
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
{/snippet}
