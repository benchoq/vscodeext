<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';

  import Row from '@/comps/Row.svelte';
  import Column from '@/comps/Column.svelte';
  import * as viewlogic from './viewlogic.svelte';
  // import EmptyState from '@/comps/EmptyState.svelte';
  // import ExGridViewItem from './ExGridViewItem.svelte';
  // import { ui } from './states.svelte';
  // import { exBrowser as texts } from '@/apps/texts';

  let {
    examples = [] as ExEntry[],
  } = $props();

  // function onScroll() {
  //   ui.overlays.details.collapsed = true;
  // }
</script>

<Column>
  {#each examples as example (example)}
    <button
      onclick={() => {
        viewlogic.selectExample(example);
      }}
    >
      <Row class='list-item'>
        <div class='title'>{example.name}</div>
        <div class='grow'></div>
        <div class='category'>{example.categories.join(', ')}</div>
      </Row>
    </button>
  {/each}
</Column>

<style>
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

  :global(.title) {
    flex-shrink: 1;
    min-width: 60px;
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
</style>
