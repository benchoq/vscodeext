<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->
<script lang="ts">
  import { exBrowser as texts } from '@/apps/texts';

  import { data, ui } from '../../states.svelte';
  import * as viewlogic from '../../viewlogic.svelte';
</script>

<div class='qt-item-list flex flex-col'>
  <span class='title'>{texts.catalog.categories}</span>

  {#each data.categories as cat (cat)}
    <button
      class='item flex flex-row'
      class:active={cat === ui.filter.category}
      onclick={async () => {
        await viewlogic.selectCategory(cat);
        viewlogic.setOverlayVisible('catalog', false);
      }}
    >
      <span class='flex-1'>{cat.name}</span>
      <span data-count>{cat.count}</span>
    </button>
  {/each}
</div>

<style>
  [data-count] {
    opacity: 0.65;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
</style>
