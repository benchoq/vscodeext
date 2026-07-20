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

<div class='flex flex-col min-w-0 sections'>
  {#each categories as category (category)}
    {#if category.type !== 'all'}
      <ExCollapsibleSection {category} />
    {/if}
  {/each}
</div>

<style>
  .sections {
    padding: 0 14px 24px;
  }
</style>
