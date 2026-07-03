<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/app.css';
  import Column from '@/comps/Column.svelte';
  import ExCollapsibleSection from './ExCollapsibleSection.svelte';
  import ExHeader from './ExHeader.svelte';
  import ExOverlaysContainer from './ExOverlaysContainer.svelte';
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());

  const categories = $derived.by(() => {
    if (!ui.filter.category || ui.filter.category.type === 'all') {
      return data.categories;
    }

    return [ui.filter.category];
  });

</script>

<div class='w-screen h-screen p-2 flex flex-col relative'>
  <ExHeader />

  <div class='sections'>
    <Column class='!gap-[14px]'>
      {#each categories as category (category)}
        {#if category.type !== 'all'}
          <ExCollapsibleSection {category} />
        {/if}
      {/each}
    </Column>

    <ExOverlaysContainer />
  </div>
</div>

<style>
  :global(.sections) {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 14px 24px;
    min-width: 0;
  }
</style>
