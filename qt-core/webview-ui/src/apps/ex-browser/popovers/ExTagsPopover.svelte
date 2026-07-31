<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let inputEl: HTMLElement | undefined = undefined;

  onMount(() => {
    requestAnimationFrame(() => {
      inputEl?.focus();
    });
  });
</script>

<svelte:options runes={true} />

<div data-comp-root class='flex flex-col'>
  <div
    data-search-section
    class='flex flex-row'
  >
    <input
      bind:this={inputEl}
      type='text'
      class='flex-1'
      placeholder='Filter tags...'
    />
  </div>

  <div
    data-list-section
    class='qt-item-list flex flex-col'
  >
    {#each ui.filter.category?.tags as tag (tag)}
      <button
        class='item flex flex-row'
        class:active={viewlogic.isTagSelected(tag)}
        onclick={async () => {
          await viewlogic.toggleTag(tag);
        }}
      >
        <span data-hash>#</span>
        <span data-name class='flex-1'>{tag}</span>
        <span data-count>10</span>
    </button>
    {/each}
  </div>
</div>

<style>
  [data-comp-root] {
    z-index: 200;
    width: 380px;
    max-height: 300px;
    background: var(--qt-bg-subtle);
    border: 1px solid var(--qt-stroke-muted);
    border-radius: var(--qt-radius-m);
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    flex-direction: column;
    overflow: hidden;

    & > [data-search-section] {
      padding: 8px 10px;
      flex-shrink: 0;

      & input {
        height: 24px;
        background: var(--qt-bg-input);
        border: 1px solid transparent;
        border-radius: var(--qt-radius-s);
        color: var(--qt-text-default);
        font-family: inherit;
        font-size: 11px;
        padding: 0 8px;
        outline: none;

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

    & > [data-list-section] {
      border-top: 1px solid var(--qt-stroke-subtle);
      overflow-y: auto;
      padding: 8px 10px;
      display: flex;
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
        font-size: 12px;
        cursor: pointer;
        text-align: left;
        transition: background var(--duration-short);
        flex-shrink: 0;

        &:hover {
          background: var(--qt-hover-bg);
        }

        & > [data-hash] {
          font-size: 11px;
          opacity: 0.5;
        }

        & > [data-count] {
          font-size: 10px;
          color: var(--qt-text-muted);
        }

        &.active {
          background: var(--accent-blue-a18);
          color: var(--qt-accent-active);
        }
      }
    }
  }
</style>
