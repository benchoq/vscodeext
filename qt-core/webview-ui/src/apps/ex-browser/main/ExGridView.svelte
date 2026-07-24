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

  function onScroll() {
    ui.overlays.details.collapsed = true;
  }
</script>

<div
  bind:this={ui.grid}
  data-comp-grid
  class='grid grid-flow-dense'
  role='grid'
  tabindex="0"
  onkeydown={() => {}}
  onscroll={onScroll}
  onclick={(e) => {
    if (e.target === e.currentTarget) {
      ui.overlays.details.visible = false;
    }
  }}
>
  {#each examples as example (example)}
    <ExGridViewItem {example}/>
  {/each}
</div>

<style>
  [data-comp-grid] {
    grid-template-columns: repeat(auto-fill,minmax(232px,1fr));
    grid-auto-rows: 220px;
    gap: 10px;
    overflow: auto;
    user-select: none;
  }
</style>
