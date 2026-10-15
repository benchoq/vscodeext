<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, type Snippet, untrack } from 'svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import { createVerticalScroller } from '@/comps/VerticalScroller.svelte';
  import QtHelpView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';
  import QtHelpScrollToTopButton from '../others/QtHelpScrollToTopButton.svelte';

  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let listEl: VirtualList;
  let listHeight = $state(0);
  let inputEl = $state<HTMLInputElement | undefined>();

  const all = $derived(data.search.result);
  const scroller = createVerticalScroller();

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function splitByKeyword(text: string, keyword: string) {
    const words = keyword.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [{ text, match: false }];
    }

    const re = new RegExp(`(${words.map(escape).join('|')})`, 'gi');
    return text
      .split(re)
      .map((t, i) => ({ text: t, match: i % 2 === 1 }))
      .filter((s) => s.text);
  }

  $effect(() => {
    void ui.search.keyword;
    untrack(() => {
      listEl.recomputeSizes?.(0);
    });
  })

  onMount(() => {
    inputEl?.focus();
    inputEl?.select();
  })

</script>

<QtHelpView
  header={header as Snippet}
  content={content as Snippet}
  itemCount={all.length}
/>

<!-- snippets -->
{#snippet header()}
  <div class='flex flex-row w-full gap-2'>
    <span class='self-center'>Search</span>

    <QtHelpSearchInput
      bind:inputEl={inputEl}
      bind:value={ui.search.keyword}
      placeholder='keyword...'
      onSearch={() => {
        viewlogic.search(ui.search.keyword);
      }}
    />
  </div>
{/snippet}

{#snippet content()}
  <div
    use:scroller.attach
    bind:clientHeight={listHeight}
    class='qt-item-list w-full h-full relative'
  >
    <VirtualList
      bind:this={listEl}
      height={listHeight}
      scrollDirection='vertical'
      itemCount={all.length}
      itemSize={70}
    >
      {#snippet item({ style, index })}
        {@render _item(style, index)}
      {/snippet}
    </VirtualList>

    {#if scroller.scrolledEnough}
      <QtHelpScrollToTopButton onClicked={() => scroller.scrollToTop()} />
    {/if}
  </div>
{/snippet}

{#snippet _item(style: string, index: number)}
  {@const entry = all[index]}
  <button
    {style}
    class='item flex flex-col'
    class:active={viewlogic.isCurrentDoc(entry.page)}
    onclick={() => {
      viewlogic.openHtml(entry.page);
    }}
  >
    <span data-role='title'>{entry.page.title}</span>
    <span data-role='detail'>
      {@render highlight(entry.snippet)}
    </span>
  </button>
{/snippet}

{#snippet highlight(text: string)}
  {#each splitByKeyword(text, data.search.keyword) as s, i (i)}
    {#if s.match}
      <mark>{s.text}</mark>
    {:else}
      {s.text}
    {/if}
  {/each}
{/snippet}

<style>
  [data-role='title'] {
    @apply truncate text-left;
    color: var(--qt-text-default);
  }

  [data-role='detail'] {
    @apply line-clamp-2 text-left;
    @apply whitespace-normal break-all;
    opacity: 0.5;
    color: var(--qt-text-muted);
  }

  [data-role='scroll-to-top'] {
    right: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    opacity: 0.8;
    color: var(--qt-button-fg);
    background: var(--qt-button-primary-bg);

    &:hover {
      opacity: 1.0;
      cursor: pointer;
    }
  }

  .qt-item-list {
    overflow: hidden;
  }

  mark {
    color: var(--qt-button-fg);
    background: var(--qt-button-primary-bg);
    border-radius: var(--qt-radius-s);
    padding: 1px;
  }
</style>
