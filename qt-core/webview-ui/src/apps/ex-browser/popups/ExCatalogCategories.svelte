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
  <p class='ex-catalog-section-title'>{texts.catalog.categories}</p>

  {#each data.categories as cat (cat)}
    <button
      class='ex-catalog-list-item flex flex-row'
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
  .item-name {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 13px;
    cursor: pointer;
    transition: var(--transition-fast);
  }

  .item-count {
    opacity: 0.65;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    margin-left: 8px;
  }
</style>
