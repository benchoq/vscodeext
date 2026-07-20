<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Grid, List } from '@/icons';
  import { ui } from '../states.svelte';
  import ExHeaderTags from './ExHeaderTags.svelte';
  import ExHeaderBreadcrumb from './ExHeaderBreadcrumb.svelte';
  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';
</script>

<div class="header-panel w-full flex flex-col shrink-0">
  <div class="w-full flex flex-row gap-[6px]">
    <ExHeaderBreadcrumb />
    <ExHeaderTags />
    <ExHeaderSearchInput />
    <div class='flex flex-row qt-tool-button-group'>
      {@render ViewModeToolButton('grid')}
      {@render ViewModeToolButton('list')}
    </div>
  </div>
  <div class="w-full flex flex-row gap-[6px]">
    {#each ui.filter.query.split(' ') as q (q)}
      <div>{q}</div>
    {/each}
  </div>
</div>

<!-- snippets -->
{#snippet ViewModeToolButton(mode: 'grid' | 'list')}
  <button
    class='qt-tool-button w-[26px] h-[26px]'
    class:active={ui.selected.viewMode === mode}
    title="List view"
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
  .header-panel {
    padding: 8px 14px;
    gap: 7px;
    background: var(--qt-bg-subtle);
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }
</style>
