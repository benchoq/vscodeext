<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExCategory, type ExEntry } from '@shared/ex-browser';
  import EmptyState from '@/comps/EmptyState.svelte';
  import ExCollapsibleSection from '../others/ExCollapsibleSection.svelte';
  import ExGridView from './ExGridView.svelte';
  import ExListView from './ExListView.svelte';
  import { exBrowser as texts } from '@/apps/texts';
  import { data, ui } from '../states.svelte';

  const all = $derived.by(() => {
    const categories =
      (ui.filter.category && ui.filter.category.type !== 'all')
      ? [ui.filter.category] : data.categories;

    return categories
      .map((cat) => ({
        category: cat,
        examples: findExamples(cat)
      }))
      .filter((e) => e.examples.length !== 0);
  })

  function findExamples(category?: ExCategory) {
    if (category?.type === 'general') {
      const name = category?.name.trim() ?? '';
      return data.examples.filter((ex) => ex.categories.includes(name));
    }

    return category?.type === 'all' ? data.examples : [];
  }
</script>

<div data-comp-root class='flex-1 min-w-0 flex flex-col'>
  {#if all.length !== 0}
    {#each all as { category, examples } (category)}
      {#if category.type === 'general' && examples.length !== 0}
        {@render SingleCategory(category, examples)}
      {/if}
    {/each}
  {:else}
    {@render EmptyStateInfo()}
  {/if}
</div>

{#snippet SingleCategory(category: ExCategory, examples: ExEntry[])}
  {@const count = examples.length}
  {@const View = (ui.selected.viewMode === 'grid') ? ExGridView : ExListView}

  <ExCollapsibleSection title={category?.name ?? ''} {count}>
    <View {examples} />
  </ExCollapsibleSection>
{/snippet}

{#snippet EmptyStateInfo()}
  {@const lines = (data.packages.length === 0)
    ? texts.empty.package
    : ((all.length === 0) ? (texts.empty.example) : [])
  }

  <EmptyState text={texts.empty.title} class='!gap-10'>
    {#each lines as l (l) }
      {l}<br>
    {/each}
  </EmptyState>
{/snippet}

<style>
  [data-comp-root] {
    padding: 0px 14px 14px;
    overflow: hidden auto;
  }
</style>
