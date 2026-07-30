<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  import ExTagChip from '../others/ExTagChip.svelte';
  import ExHeaderTags from './ExHeaderTags.svelte';
  import ExHeaderBreadcrumb from './ExHeaderBreadcrumb.svelte';
  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';
  import ExHeaderViewModeButtons from './ExHeaderViewModeButtons.svelte';

  const tags = $derived.by(() => {
    return ui.filter.query.split(' ')
      .map((e) => { return e.startsWith("#") ? e.substring(1) : e; })
      .filter((e) => e.length !== 0);
  });
</script>

<div data-comp-root class="flex flex-col">
  <div data-filter class="flex flex-row">
    <ExHeaderBreadcrumb />
    <ExHeaderTags />
    <ExHeaderSearchInput />
    <ExHeaderViewModeButtons />
  </div>

  {#if tags.length !== 0}
    <div data-tags class="flex flex-wrap">
      {#each tags as tag (tag)}
        <ExTagChip
          text={tag}
          onClicked={() => {
            viewlogic.toggleTagInQuery(tag);
          }}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  [data-comp-root] {
    flex-shrink: 0;
    gap: 7px;
    padding: 8px 14px;
    background: var(--qt-bg-subtle);
    border-bottom: 1px solid var(--qt-stroke-subtle);

    & > [data-filter] {
      gap: 6px;
    }

    & > [data-tags] {
      align-items: center;
      gap: 5px;
    }
  }
</style>
