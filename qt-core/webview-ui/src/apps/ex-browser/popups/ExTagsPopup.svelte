<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='tag-panel flex flex-col'>
  <div class='tag-input-wrapper'>
    <input
      class='tag-input'
      placeholder='Filter tags...'
    />
  </div>

  <div
    class='ex-tags-list flex flex-col'
  >
    {#each ui.filter.category?.tags as tag (tag)}
      <button
        class='ex-catalog-list-item flex flex-row'
        onclick={async () => {
          await viewlogic.toggleTagInQuery(tag);
        }}
      >
        <p>#</p>
        <p class='flex flex-1'>{tag}</p>
        <p class='item-count'>10</p>
    </button>
    {/each}
  </div>
</div>

<style>
  .tag-panel {
    width: var(--tags-popup-width);
    max-height: var(--tags-popup-max-height);

    background: var(--qt-bg-subtle);
    border: 1px solid var(--qt-stroke-muted);
    border-radius: var(--qt-radius-m);
    box-shadow: var(--popup-shadow);
    flex-direction: column;
    overflow: hidden;
  }

  .tag-input-wrapper {
    padding: 8px 10px;
    border-bottom: 1px solid var(--qt-stroke-subtle);
    flex-shrink: 0;
  }

  .tag-input {
    width: 100%;
    height: 24px;
    background: var(--qt-bg-input);
    border: 1px solid transparent;
    border-radius: var(--qt-radius-s);
    color: var(--qt-text-default);
    font-family: inherit;
    font-size: 11px;
    padding: 0 8px;
    outline: none;
  }

  .ex-tags-list {
    overflow-y: auto;
    padding: 8px 10px;
    background: var(--qt-bg-default);
  }

  .item-count {
    margin-left: 8px;
    opacity: 0.65;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

</style>
