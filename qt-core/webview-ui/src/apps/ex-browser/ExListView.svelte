<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Tag } from '@/icons';
  import { type ExEntry } from '@shared/ex-browser';

  import Row from '@/comps/Row.svelte';
  import Column from '@/comps/Column.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  let {
    examples = [] as ExEntry[],
  } = $props();

</script>

<Column class='list-view'>
  {#each examples as example (example)}
    <button
      onclick={() => {
        viewlogic.selectExample(example);
      }}
    >
      <Row class={`
        list-item
        ${example === ui.selected.example ? 'selected' : ''}
        `}>
        <div class='title'>{example.name}</div>
        <Row class='tags-container'>
          <div class='tag-icon'><Tag /></div>
          {#each example.tags as tag (tag)}
            <div class='tag'>{tag}</div>
          {/each}
        </Row>
        <div class='grow'></div>
        <div class='category'>{example.categories.join(', ')}</div>
      </Row>
    </button>
  {/each}
</Column>

<style>
  :global(.list-view) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :global(.list-item) {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    height: 36px;
    border-radius: var(--qt-radius-s);
    border: 1px solid var(--qt-stroke-subtle);
    cursor: pointer;
    background: var(--qt-bg-elevated);
    transition: border-color 120ms, background 120ms;
  }

  :global(.list-item:hover) {
    border-color: var(--qt-stroke-muted);
    background: var(--qt-hover-bg);
  }

  :global(.list-item.selected) {
    border-color: var(--qt-accent-info);
    background: rgba(0,122,204,0.09);
  }

  :global(.title) {
    flex-shrink: 1;
    font-size: 13px;
    font-weight: 500;
    color: var(--qt-text-default);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.category) {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 600;
    color: var(--qt-text-muted);
    white-space: nowrap;
    opacity: 0.8;
  }

  :global(.tags-container) {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    overflow: hidden;
  }

  :global(.tag-icon) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--qt-text-muted);
    opacity: 0.6;
    width: 13px;
    height: 13px;
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
</style>
