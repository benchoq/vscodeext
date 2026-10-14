<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, type Snippet, untrack } from 'svelte';
  import { ChevronUp } from '@lucide/svelte';
  import VirtualList from 'svelte-tiny-virtual-list';

  import QtHelpView from './QtHelpBaseView.svelte';
  import QtHelpSearchInput from '../others/QtHelpSearchInput.svelte';
  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let listEl: VirtualList;
  let listHeight = $state(0);
  let listWrapperEl = $state<HTMLDivElement>();

  let inputEl = $state<HTMLInputElement | undefined>();
  let canScrollToTop = $state(false);

  const all = $derived(data.search.result);

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

  function getListScroller() {
    if (!listWrapperEl) {
      return undefined;
    }

    const all = [
      listWrapperEl,
      ...listWrapperEl.querySelectorAll<HTMLElement>('*')
    ]

    return all.find((el) => el.scrollHeight > el.clientHeight);
  };

   function hookScroller() {
    let disposed = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cleanup: (() => void) | undefined;

    function attach() {
      if (disposed) {
        return;
      }

      const scroller = getListScroller();

      if (!scroller) {
        timeoutId = setTimeout(attach, 100);
        return;
      }

      const updateScrollButton = () => {
        canScrollToTop = scroller.scrollTop > 200;
      };

      scroller.addEventListener('scroll', updateScrollButton);
      updateScrollButton();

      cleanup = () => {
        scroller.removeEventListener('scroll', updateScrollButton);
      };
    }

    requestAnimationFrame(attach);

    return () => {
      disposed = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      cleanup?.();
    };
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
    return hookScroller();
  })

  export function scrollToTop() {
    const listScroller = getListScroller();
    if (!listScroller) {
      return;
    }

    const duration = 150;
    const start = listScroller.scrollTop;
    const startTime = performance.now();

    function animate(now: number) {
      if (!listScroller) {
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;

      listScroller.scrollTop = start * (1 - eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }
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
    bind:this={listWrapperEl}
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

    {#if canScrollToTop}
      {@render scrollToTopButton()}
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

{#snippet scrollToTopButton()}
  <button
    data-role='scroll-to-top'
    class='absolute flex items-center justify-center'
    onclick={scrollToTop}
  >
    <ChevronUp />
  </button>
{/snippet}

<style>
  .qt-item-list {
    overflow: hidden;
  }

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

  mark {
    color: var(--qt-button-fg);
    background: var(--qt-button-primary-bg);
    border-radius: var(--qt-radius-s);
    padding: 1px;
  }
</style>
