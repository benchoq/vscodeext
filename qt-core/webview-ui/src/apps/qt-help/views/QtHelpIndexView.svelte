<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount, type Snippet } from 'svelte';
  import { Dot } from '@lucide/svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import { createVerticalScroller } from '@/comps/VerticalScroller.svelte';
  import QtHelpBaseView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';
  import QtHelpScrollToTopButton from '../others/QtHelpScrollToTopButton.svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { type IndexOrHeader } from '../types.svelte';

  const all = $derived(ui.index.filtered);

  let virtualList: VirtualList;
  let virtualListHeight = $state(0);
  let inputEl = $state(undefined as HTMLInputElement | undefined);
  let hovered = $state<IndexOrHeader | undefined>();
  const scroller = createVerticalScroller();

  function isModuleNameVisible(entry: IndexOrHeader) {
    const n1 = entry.data?.name;
    const n2 = hovered?.data?.name;

    return n1 !== undefined
      && n2 !== undefined
      && (n1.length !== 0)
      && (n1 === n2)
  }

  $effect(() => {
    void ui.index.filter.keyword;
    untrack(() => {
      virtualList.recomputeSizes?.(0);
    });
  })

  onMount(() => {
    inputEl?.focus();
    inputEl?.select();
  })
</script>

<QtHelpBaseView
  header={header as Snippet}
  content={content as Snippet}
  itemCount={all.length}
/>

{#snippet header()}
  <div class='flex flex-row w-full gap-2'>
    <span class='self-center'>Index</span>

    <QtHelpSearchInput
      bind:inputEl={inputEl}
      bind:value={ui.index.filter.keyword}
      placeholder='filter...'
      onSearch={() => {
        viewlogic.updateFilteredIndex();
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
      itemSize={24}
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

{#snippet  _item(style: string, index: number)}
  {@const entry: IndexOrHeader = all[index]}
  {#if entry}
    <button
      {style}
      class='item w-full flex flex-row items-center relative'
      onmouseenter={() => (hovered = entry)}
      onmouseleave={() => (hovered = undefined)}
      onclick={() => {
        if (entry.type !== 'section-header' && entry.data?.page) {
          viewlogic.openHtml(entry.data.page);
        }
      }}
    >
      <div
        data-role={entry.type}
        class='w-full h-full flex items-center'
      >
        {#if entry.type === 'section-item'}
          <Dot />
        {/if}

        {entry.display}
    </div>

      {#if entry.parsedTitle?.module}
        <span
          data-role='qt-module'
          class='qt-absolute-cy'
          style:opacity={isModuleNameVisible(entry) ? 1 : 0}
        >
          {entry.parsedTitle.module}
        </span>
      {/if}
    </button>
  {/if}
{/snippet}

<style>
  .qt-item-list {
    overflow: hidden;
  }

  .item {
    padding: 0px;
  }

  [data-role='item'],
  [data-role='section-item'],
  [data-role='section-header'] {
    @apply truncate;
    min-width: 0px;
    text-align: left;
    font-size: var(--qt-font-s);
    color: var(--qt-text-muted);
    padding: 3px 12px;
  }

  [data-role='section-item'] {
    padding-left: 20px;
  }

  [data-role='section-header'] {
    cursor: default;
  }

  [data-role='qt-module'] {
    right: 0px;
    padding: 0px 5px;
    margin-right: 2px;
    color: var(--qt-text-muted);
    font-size: var(--qt-font-xs);
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
    transition: opacity var(--qt-duration-fast);
  }
</style>
