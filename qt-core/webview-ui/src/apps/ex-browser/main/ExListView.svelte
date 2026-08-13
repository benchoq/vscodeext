<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';
  import ExTagList from '../others/ExTagList.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let {
    examples = [] as ExEntry[],
  } = $props();

</script>

<div
  bind:this={ui.list}
  data-root
  class='flex flex-col'
>
  {#each examples as example (example)}
    <button
      data-item
      class='flex items-center'
      class:selected={example === ui.selected.example}
      onclick={() => {
        viewlogic.selectExample(example);
      }}
    >
      <span data-role='list-name'>{example.name}</span>
      {#if example.tags.length}
        <ExTagList
          usage='list'
          tags={example.tags}
        />
      {/if}
      <span data-role='list-category'>{example.categories.join(', ')}</span>
    </button>
  {/each}
</div>

<style>
  [data-root] {
    gap: 2px;

    & > [data-item] {
      height: 36px;
      padding: 0 10px;
      background: var(--qt-bg-elevated);
      border: 1px solid var(--qt-stroke-subtle);
      border-radius: var(--qt-radius-s);
      gap: 10px;
      cursor: pointer;
      transition-property: border-color, background;
      transition-duration: var(--duration-base);

      &:hover {
        background: var(--qt-hover-bg);
        border-color: var(--qt-stroke-muted);
      }

      &.selected {
        background: var(--accent-blue-a9);
        border-color: var(--qt-accent-info);
      }
    }
  }

  [data-role='list-name'] {
    color: var(--qt-text-default);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
  }

  [data-role='list-category'] {
    color: var(--qt-text-muted);
    margin-left: auto;
    opacity: 0.8;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
