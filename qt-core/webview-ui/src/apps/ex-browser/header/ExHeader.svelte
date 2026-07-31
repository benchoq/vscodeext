<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExHeaderTags from './ExHeaderTagButton.svelte';
  import ExHeaderBreadcrumb from './ExHeaderBreadcrumb.svelte';
  import ExHeaderSearchInput from './ExHeaderSearchInput.svelte';
  import ExHeaderSelectedTags from './ExHeaderSelectedTags.svelte';
  import ExHeaderViewModeButtons from './ExHeaderViewModeButtons.svelte';
</script>

<div data-comp-root class="flex flex-col">
  <div data-filter class="flex flex-row">
    <ExHeaderBreadcrumb />
    <ExHeaderTags />
    <ExHeaderSearchInput />
    <ExHeaderViewModeButtons />
  </div>

  <ExHeaderSelectedTags />
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
