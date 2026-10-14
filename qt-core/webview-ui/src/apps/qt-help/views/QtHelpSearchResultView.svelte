<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  import QtHelpView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';
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
  <div class='flex flex-row w-full gap-2'>
    <span class='items-center self-center'>
      Search
    </span>

    <QtHelpSearchInput
      bind:inputEl={inputEl}
      bind:value={ui.search.keyword}
      placeholder='keyword...'
      onSearch={() => {
        console.log(ui.search.keyword)
        viewlogic.search(ui.search.keyword);
      }}
    />
  </div>
{/snippet}

{#snippet content()}
  <div class='qt-item-list w-full flex flex-col'>
    {#each data.fullText as entry, i (i)}
      <button
        class='item w-full flex flex-col'
        class:active={viewlogic.isCurrentDoc(entry.page)}
        onclick={() => {
          viewlogic.openHtml(entry.page);
        }}
      >
        <span data-role='title'>{entry.page.title}</span>
        <span data-role='detail'>{entry.snippet}</span>
      </button>
    {/each}
  </div>
{/snippet}

<style>
  [data-role='title'] {
    @apply truncate;
    color: var(--qt-text-default);
  }

  [data-role='detail'] {
    @apply line-clamp-3;
    opacity: 0.65;
    white-space: normal;
    word-break: break-all;
    color: var(--qt-text-muted);
  }
</style>
