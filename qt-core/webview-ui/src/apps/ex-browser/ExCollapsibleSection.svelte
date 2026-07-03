<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ChevronDown } from "@lucide/svelte";

  import { type ExCategory } from '@shared/ex-browser';
  import ExGridView from './ExGridView.svelte';
  import { data } from './states.svelte';

  let {
    category = undefined as ExCategory | undefined,
    expanded = $bindable(true)
  } = $props();

  const examples = $derived.by(() => {
    switch (category?.type) {
      case 'featured':
        return data.examples.filter((ex) => ex.highlighted);

      case 'general': {
        const name = category?.name.trim() ?? '';
        return data.examples.filter((ex) => ex.categories.includes(name));
      }

      case 'all':
        return data.examples;

      default:
        return [];
    }
  });

</script>

<div class="flex flex-col">
  <button
    class={`
      flex items-center justify-between py-2 pr-5 select-none
      sticky top-0 z-1 bg-[var(--qt-bg-elevated)]
    `}
    onclick={() => expanded = !expanded}
  >
    <div class="flex items-center gap-2">
      <ChevronDown class={expanded ? 'rotate-0' : '-rotate-90'} />
      <span class="text-xs font-semibold tracking-wide text-muted uppercase">
        {category?.name ?? ''}
      </span>
    </div>

    <span class="text-xs text-muted">
      {category?.count ?? 0}
    </span>
  </button>

  {#if expanded}
    <ExGridView {examples}/>
    <!-- <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 pb-4">
      {#each items as item (item.id)}
        <ExampleCard {item} />
      {/each}
    </div> -->
  {/if}
</div>
