<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import ExTagList from '../others/ExTagList.svelte';

  import ExHeaderBreadcrumbAndTags from './ExHeaderBreadcrumbAndTags.svelte';
  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';
  import ExHeaderViewModeButtons from './ExHeaderViewModeButtons.svelte';
</script>

<div data-comp-root class="flex flex-col">
  <div data-filter class="flex flex-row">
    <ExHeaderBreadcrumbAndTags />
    <ExHeaderSearchInput />
    <ExHeaderViewModeButtons />
  </div>

  {#if ui.filter.tags.length}
    <ExTagList
      usage='header'
      tags={ui.filter.tags}
    />
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
  }
</style>
