<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { untrack, onMount, type Snippet } from 'svelte';
  import { Dot } from '@lucide/svelte';
  import VirtualList, { type ItemsUpdatedDetail } from 'svelte-tiny-virtual-list';

  import ScrollToTopButton from '@/comps/ScrollToTopButton.svelte';
  import { createVerticalScroller } from '@/comps/VerticalScroller.svelte';
  import QtHelpBaseView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import { type IndexOrHeader } from '../types.svelte';

  let virtualListHeight = $state(0);
  // let topIndex = $state(-1);

  const all = $derived(ui.index.filtered);
  // const topItem = $derived<IndexOrHeader | undefined>(all[topIndex]);
  // const section = $derived(topItem?.name[0].toUpperCase() ?? '');

  let inputEl = $state(undefined as HTMLInputElement | undefined);
  let hovered = $state<IndexOrHeader | undefined>();
  const scroller = createVerticalScroller();

  function isModuleNameVisible(entry: IndexOrHeader) {
    const n1 = entry.name;
    const n2 = hovered?.name;
    return (n1.length !== 0) && n2 && (n1 == n2);
  }

  function onVirtualListItemsUpdated(e: ItemsUpdatedDetail) {
    const name = (all[e.start].data?.name[0] ?? '').toLocaleLowerCase();
    ui.index.section = name;
  }

  $effect(() => {
    void ui.index.filter.keyword;
    untrack(() => {
      ui.popovers.indexSelector.refVirtualList?.recomputeSizes?.(0);
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
  <div class='flex flex-row w-full gap-1.5'>
    <span class='self-center'>Index</span>

    <QtHelpSearchInput
      bind:inputEl={inputEl}
      bind:value={ui.index.filter.keyword}
      placeholder='filter...'
      onSearch={() => {
        viewlogic.updateFilteredIndex();
      }}
    />

    {#if ui.index.section}
      {@render listSectionButton(ui.index.section)}
    {/if}
  </div>
{/snippet}

{#snippet content()}
  <div class='w-full h-full flex flex-col relative'>
    <div
      use:scroller.attach
      bind:clientHeight={virtualListHeight}
      class='qt-item-list w-full h-full relative'
    >
      <VirtualList
        bind:this={ui.popovers.indexSelector.refVirtualList}
        scrollOffset={ui.popovers.indexSelector.scrollOffset}
        height={virtualListHeight}
        scrollDirection='vertical'
        itemCount={all.length}
        itemSize={24}
        onItemsUpdated={onVirtualListItemsUpdated}
        // scrollToIndex={ui.popovers.indexSelector.scrollToIndex}
        scrollToAlignment="start"
        scrollToBehaviour="smooth"
      >
        {#snippet item({ style, index })}
          {@render _item(style, index)}
        {/snippet}
      </VirtualList>

      {#if scroller.scrolledEnough}
        <ScrollToTopButton onClicked={() => scroller.scrollToTop()} />
      {/if}
    </div>
  </div>
{/snippet}

{#snippet  _item(style: string, index: number)}
  {@const entry: IndexOrHeader = all[index]}
  {#if entry}
    <button
      {style}
      class='item w-full flex flex-row items-center relative'
      class:active={entry.data?.page && viewlogic.isCurrentDoc(entry.data?.page)}
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

{#snippet listSectionButton(section: string)}
  <button
    bind:this={ui.popovers.indexSelector.refEl}
    data-role='section-button'
    class='flex flex-row items-center'
    onclick={() => {
      ui.popovers.indexSelector.toggle();
    }}
  >
    <span data-role='section-name'>
      {section}
    </span>
  </button>
{/snippet}

<style>
  .qt-item-list {
    overflow: hidden;
  }

  .item {
    padding: 0px;
  }

  [data-role='section-button'] {
    padding: 0px 10px;
    background: var(--qt-hover-bg);
    border-radius: var(--qt-radius-s);

    &:hover {
      background: var(--qt-button-primary-hover);
    }
  }

  [data-role='section-name'] {
    color: var(--qt-text-default);
    display: inline-block;
    width: 1.2em;
    text-align: center;
    text-transform: uppercase;
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
    padding-left: 14px;
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
