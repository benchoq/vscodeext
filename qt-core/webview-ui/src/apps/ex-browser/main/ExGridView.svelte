<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';

  import ExGridViewItem from './ExGridViewItem.svelte';
  import { ui } from '../states.svelte';

  let {
    examples = [] as ExEntry[],
  } = $props();
</script>

<div
  bind:this={ui.grid}
  data-comp-grid
  class='grid grid-flow-dense'
  role='grid'
>
  {#each examples as example (example)}
    <ExGridViewItem {example}/>
  {/each}
</div>

<style>
  [data-comp-grid] {
    grid-template-columns: repeat(auto-fill,minmax(var(--card-min-width),1fr));
    grid-auto-rows: var(--card-min-height);
    gap: 10px;
    overflow: hidden;
    user-select: none;
  }
</style>
