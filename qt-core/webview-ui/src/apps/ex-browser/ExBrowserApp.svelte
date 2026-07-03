<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/app.css';
  import ExCollapsibleSection from './ExCollapsibleSection.svelte';
  import ExHeader from './ExHeader.svelte';
  import ExOverlaysContainer from './ExOverlaysContainer.svelte';
  import { data } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='w-screen h-screen p-2 flex flex-col gap-2 relative'>
  <ExHeader />

  <div class='grow min-h-0 relative'>
    {#each data.categories as category (category)}
      {#if category.type !== 'all'}
        <ExCollapsibleSection {category} />
      {/if}
    {/each}

    <ExOverlaysContainer />
  </div>
</div>
