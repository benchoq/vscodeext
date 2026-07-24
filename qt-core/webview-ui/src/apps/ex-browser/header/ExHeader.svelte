<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Grid, List } from '@/icons';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  import ExTagChip from '../others/ExTagChip.svelte';
  import ExHeaderTags from './ExHeaderTags.svelte';
  import ExHeaderBreadcrumb from './ExHeaderBreadcrumb.svelte';
  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';

  const tags = $derived.by(() => {
    return ui.filter.query.split(' ').map((e) => {
      return e.startsWith("#") ? e.substring(1) : e;
    })
  });
</script>

<div data-comp-root class="flex flex-col shrink-0 gap-[7px]">
  <div class="flex flex-row gap-[6px]">
    <ExHeaderBreadcrumb />
    <ExHeaderTags />
    <ExHeaderSearchInput />

    <div class='qt-button-group flex flex-row'>
      {@render ViewModeButton('grid')}
      {@render ViewModeButton('list')}
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-[5px]">
    {#each tags as tag (tag)}
      <ExTagChip
        text={tag}
        onClicked={() => {
          viewlogic.toggleTagInQuery(tag);
        }}
      />
    {/each}
  </div>
</div>

<!-- snippets -->
{#snippet ViewModeButton(mode: 'grid' | 'list')}
  <button
    class='qt-tool-button'
    aria-pressed={ui.selected.viewMode === mode}
    onclick={() => {
      ui.selected.viewMode = mode;
    }}
  >
    {#if mode === 'grid'}
      <Grid />
    {:else}
      <List />
    {/if}
  </button>
{/snippet}

<style>
  [data-comp-root] {
    padding: 8px 14px;
    background: var(--qt-bg-subtle);
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }
</style>
