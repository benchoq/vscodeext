<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';

  import ExGridCard from './ExGridCard.svelte';
  import { ui } from '../states.svelte';

  let {
    examples = [] as ExEntry[],
  } = $props();
</script>

<div
  bind:this={ui.grid}
  data-comp-root
  class='grid grid-flow-dense'
>
  {#each examples as example (example)}
    <ExGridCard {example}/>
  {/each}
</div>

<style>
  [data-comp-root] {
    grid-auto-rows: var(--card-min-height);
    grid-template-columns: repeat(auto-fill,minmax(var(--card-min-width),1fr));
    gap: 10px;
    overflow: hidden;
    user-select: none;
  }
</style>
