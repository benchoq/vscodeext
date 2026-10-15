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
  import QtHelpHighlightedText from '../others/QtHelpHighlightedText.svelte';
  import QtHelpScrollToTopButton from '../others/QtHelpScrollToTopButton.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(data.search.result);

  let virtualList: VirtualList;
  let virtualListHeight = $state(0);
  let inputEl = $state<HTMLInputElement | undefined>();
  const scroller = createVerticalScroller();

  $effect(() => {
    void ui.search.keyword;
    untrack(() => {
      virtualList.recomputeSizes?.(0);
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
    bind:clientHeight={virtualListHeight}
    class='qt-item-list w-full h-full relative'
  >
    <VirtualList
      bind:this={virtualList}
      height={virtualListHeight}
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
      <QtHelpHighlightedText
        text={entry.snippet}
        keyword={data.search.keyword}
      />
    </span>
  </button>
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

  .qt-item-list {
    overflow: hidden;
  }
</style>
