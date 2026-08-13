<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import ExCloseButton from '../others/ExCloseButton.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let inputEl: HTMLElement | undefined = undefined;

  const tags = $derived.by(() => {
    const v = ui.filter.tagsFilterInput.trim();
    const all = ui.filter.category?.tags ?? [];
    return (v.length === 0)
      ? all
      : all.filter((tag) => tag.includes(v));
  })

  function findTagCount(tag: string) {
    return ui.filter.category?.tagCounts[tag] ?? 0;
  }

  function clearSearchInput() {
    ui.filter.tagsFilterInput = '';
    inputEl?.focus();
  }

  onMount(() => {
    requestAnimationFrame(() => {
      inputEl?.focus();
    });
  });
</script>

<svelte:options runes={true} />

<div
  data-root
  class='qt-popover flex flex-col'
>
  <div data-area='search' class='relative'>
    <input
      bind:value={ui.filter.tagsFilterInput}
      bind:this={inputEl}
      type='text'
      class='qt-input w-full'
      placeholder='Filter tags...'
    />

    {#if ui.filter.tagsFilterInput.trim().length}
      <div class='absolute top-1/2 -translate-y-1/2 right-[12px]'>
        <ExCloseButton onClicked={clearSearchInput} />
      </div>
    {/if}
  </div>

  {#if tags.length !== 0}
    <div
      data-area='list'
      class='qt-item-list flex flex-col'
    >
      {#each tags as tag (tag)}
        <button
          class='item flex flex-row'
          class:active={viewlogic.isTagSelected(tag)}
          onclick={async () => {
            await viewlogic.toggleTag(tag);
          }}
        >
          <span data-role='hash'>#</span>
          <span data-role='name' class='flex-1'>{tag}</span>
          <span data-role='count'>{findTagCount(tag)}</span>
      </button>
      {/each}
    </div>
  {:else}
    <span data-role='no-match'>No tags match</span>
  {/if}
</div>

<style>
  [data-root] {
    z-index: 200;
    width: 380px;
    max-height: 300px;
    flex-direction: column;
    overflow: hidden;
  }

  [data-area='search'] {
    padding: 8px 10px;
    flex-shrink: 0;

    & input {
      height: 24px;
      background: var(--qt-bg-input);
      border: 1px solid transparent;
      border-radius: var(--qt-radius-s);
      color: var(--qt-text-default);
      padding: 0 26px 0 8px;
      outline: none;
      font-size: 11px;
      font-family: inherit;

      &:hover {
        border-color: var(--qt-stroke-muted);
        color: var(--qt-text-default);
      }

      &:focus {
        border-color: var(--qt-accent-info);
        box-shadow: none;
      }

      &[type='text']::placeholder {
        color: var(--qt-text-muted);
      }
    }
  }

  [data-area='list'] {
    border-top: 1px solid var(--qt-stroke-subtle);
    overflow-y: auto;
    padding: 8px 10px;
    gap: 5px;
    align-content: flex-start;

    & .item {
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 5px 8px;
      background: none;
      border: none;
      border-radius: var(--qt-radius-s);
      color: var(--qt-text-default);
      cursor: pointer;
      transition: background var(--duration-short);
      flex-shrink: 0;

      &:hover {
        background: var(--qt-hover-bg);
      }

      &.active {
        background: var(--accent-blue-a18);
        color: var(--qt-accent-active);
      }
    }
  }

  [data-role='name'] {
    font-size: 12px;
    text-align: left;
  }

  [data-role='hash'] {
    font-size: 11px;
    opacity: 0.5;
  }

  [data-role='count'] {
    color: var(--qt-text-muted);
    font-size: 10px;
  }

  [data-role='no-match'] {
    padding: 16px;
    color: var(--qt-text-muted);
    font-size: 11px;
    text-align: center;
  }
</style>
