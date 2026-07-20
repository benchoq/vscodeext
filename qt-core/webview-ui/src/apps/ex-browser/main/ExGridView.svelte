<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExEntry } from '@shared/ex-browser';

  import EmptyState from '@/comps/EmptyState.svelte';
  import ExGridViewItem from './ExGridViewItem.svelte';
  import { data, ui } from '../states.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  let {
    examples = [] as ExEntry[],
  } = $props();

  function onScroll() {
    ui.overlays.details.collapsed = true;
  }
</script>

{#if data.packages.length === 0}
  <EmptyState text={texts.empty.title} class='!gap-10'>
    {#each texts.empty.package as t (t) }
      {t}<br>
    {/each}
  </EmptyState>
{:else if data.examples.length === 0}
  <EmptyState text={texts.empty.title} class='!gap-10'>
    {texts.empty.example}
  </EmptyState>
{:else}
  <div
    bind:this={ui.grid}
    class='
      h-full overflow-auto
      grid
      grid-flow-dense
      grid-cols-[repeat(auto-fill,minmax(232px,1fr))]
      auto-rows-[220px]
      gap-[10px]
      select-none
    '
    tabindex="0"
    role='grid'
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
{/if}
