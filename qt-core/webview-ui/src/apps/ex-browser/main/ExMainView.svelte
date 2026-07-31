<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ExCategory } from '@shared/ex-browser';
  import ExCollapsibleSection from '../others/ExCollapsibleSection.svelte';
  import ExGridView from './ExGridView.svelte';
  import ExListView from './ExListView.svelte';
  import { data, ui } from '../states.svelte';

  const categories = $derived.by(() => {
    if (!ui.filter.category || ui.filter.category.type === 'all') {
      return data.categories;
    }

    return [ui.filter.category];
  });

  function findExamples(category?: ExCategory) {
    if (category?.type === 'general') {
      const name = category?.name.trim() ?? '';
      return data.examples.filter((ex) => ex.categories.includes(name));
    }

    return category?.type === 'all' ? data.examples : [];
  }

</script>

<div data-comp-root class='flex flex-col'>
  {#each categories as category (category)}
    {#if category.type === 'general'}
      {@const examples = findExamples(category)}
      {@const count = examples.length}
      {@const View = (ui.selected.viewMode === 'grid')
        ? ExGridView : ExListView
      }

      {#if examples.length !== 0}
        <ExCollapsibleSection title={category?.name ?? ''} {count}>
          <View {examples} />
        </ExCollapsibleSection>
      {/if}
    {/if}
  {/each}
</div>

<style>
  [data-comp-root] {
    min-width: 0;
    flex: 1;
    padding: 0px 14px 14px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
