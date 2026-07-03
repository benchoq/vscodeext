<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Tag } from '@/icons';
  import { type ExEntry } from '@shared/ex-browser';
  import Column from '@/comps/Column.svelte';
  import ExThumbnail from './ExThumbnail.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let {
    example = undefined as ExEntry | undefined,
  } = $props();

  function onClicked() {
    viewlogic.selectExample(example);
  }
</script>

<button
  class='w-full h-full !border-none relative group'
  onclick={onClicked}
>
  {#if example}
    <Column class={`
      card w-full h-full
      ${example === ui.selected.example ? 'selected' : ''}
    `}>
      <div class='thumbnail'>
        <ExThumbnail {example} />
      </div>
      <div class='title'>{example.name}</div>
      <div class='separator'></div>
      <div class='tags-container'>
        <div class='tag-icon'><Tag size={20}/></div>
        {#each example?.tags as tag (tag)}
          <div class='tag'>{tag}</div>
        {/each}
      </div>
    </Column>
  {/if}
</button>

<style>
  :global(.card) {
    min-height: 220px;
    padding: var(--qt-spacing-xl);
    display: flex;
    position: relative;
    flex-direction: column;
    gap: var(--qt-spacing-m);

    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);

    cursor: pointer;
    overflow: hidden;
    transition: border-color 120ms, background 120ms;
    animation: cardIn 160ms ease both;
  }

  :global(.card:hover) {
    border-color: var(--qt-stroke-muted);
    background: var(--qt-hover-bg);
  }

  :global(.card.selected) {
    border-color: var(--qt-accent-info);
    background: rgba(0,122,204,0.09);
  }

  :global(.thumbnail) {
    flex: 1;
    min-height: 110px;
    border-radius: var(--qt-radius-m);
    overflow: hidden;
    background: var(--qt-bg-default);
    display: flex;
    align-items: stretch;
  }

  :global(.title) {
    font-size: 13px;
    font-weight: 500;
    color: var(--qt-text-default);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
    text-align: start;
  }

  :global(.separator) {
    height: 1px;
    background: var(--qt-stroke-subtle);
    flex-shrink: 0;
  }

  :global(.tags-container) {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    flex-wrap: nowrap;
    overflow: hidden;
    min-height: 20px;
  }

  :global(.tag-icon) {
    font-size: 14px;
    color: var(--qt-text-muted);
    flex-shrink: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    margin-right: 1px;
    opacity: 0.7;
  }

  :global(.tag) {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 6px;
    border-radius: var(--qt-radius-s);
    background: var(--qt-bg-input);
    color: var(--qt-text-muted);
    border: 1px solid transparent;
    font-size: 10px;
    font-weight: 600;
    line-height: 12px;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
    font-family: inherit;
    transition: background 80ms, border-color 80ms, color 80ms;
    text-decoration: none;
  }

  :global(.tag:hover) {
    background: var(--qt-hover-bg);
    color: var(--qt-text-default);
  }
</style>