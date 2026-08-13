<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import ExTagList from '../others/ExTagList.svelte';

  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';
  import ExHeaderViewModeButtons from './ExHeaderViewModeButtons.svelte';
  import ExHeaderBreadcrumbAndTags from './ExHeaderBreadcrumbAndTags.svelte';
</script>

<div data-root class="flex flex-col shrink-0 gap-[7px]">
  <div class="flex flex-row gap-[6px]">
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
  [data-root] {
    padding: 8px 14px;
    background: var(--qt-bg-subtle);
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }
</style>
