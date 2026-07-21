<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->
<script lang="ts">
  import { exBrowser as texts } from '@/apps/texts';

  import { data, ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-col'>
  <p class='title'>{texts.catalog.categories}</p>

  {#each data.categories as cat (cat)}
    <button
      class='item flex flex-row'
      class:active={cat === ui.filter.category}
      onclick={async () => {
        await viewlogic.selectCategory(cat);
        viewlogic.setOverlayVisible('catalog', false);
      }}
    >
      <p class='item-name'>{cat.name}</p>
      <p class='item-count'>{cat.count}</p>
    </button>
  {/each}
  </div>


<style>
  .title {
    font-size: 11px;
    font-weight: 600;
    color: var(--qt-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 12px 8px;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 5px 12px;
    font-size: 13px;
    color: var(--qt-text-muted);
    cursor: pointer;
    transition: background 80ms, color 80ms;
  }

  .item.active {
    background: var(--qt-selected-bg);
    color: var(--qt-selected-fg);
  }

  .item:hover {
    background: var(--qt-hover-bg);
    color: var(--qt-text-default);
  }

  .item-name {
    display: flex;
    flex: 1;
    align-items: center;
    font-size: 13px;
    color: var(--qt-text-muted);
    cursor: pointer;
    transition: background 80ms, color 80ms;
  }

  .item-count {
    font-size: 11px;
    color: inherit;
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
    margin-left: 8px;
  }
</style>
