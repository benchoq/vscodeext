<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExCollapsibleSection from './ExCollapsibleSection.svelte';
  import { data, ui } from '../states.svelte';

  const categories = $derived.by(() => {
    if (!ui.filter.category || ui.filter.category.type === 'all') {
      return data.categories;
    }

    return [ui.filter.category];
  });
</script>

<div data-comp-root class='flex-1 flex flex-col'>
  {#each categories as cat (cat)}
    {#if cat.type === 'general'}
      <ExCollapsibleSection category={cat} />
    {/if}
  {/each}
</div>

<style>
  [data-comp-root] {
    min-width: 0;
    padding: 0 14px 24px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
