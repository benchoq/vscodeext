<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import VerticalResizeHandle from '@/comps/VerticalResizeHandle.svelte';
  import DocViewerHistoryView from '../history/DocViewerHistoryView.svelte';
  import DocViewerBookmarkView from '../bookmark/DocViewerBookmarkView.svelte';
  import { ui } from '../states.svelte';
</script>

<div data-area='side-panel' class='w-full h-full'>
  <div class='absolute h-full left-0 top-0'>
    <VerticalResizeHandle
      bind:width={ui.sidePanel.width}
      grow='left'
    />
  </div>

  {#if ui.popovers.bookmark.visible}
    <DocViewerBookmarkView />
  {/if}

  {#if ui.popovers.history.visible}
    <DocViewerHistoryView />
  {/if}
</div>

<style>
  [data-area='side-panel'] {
    background: var(--qt-bg-subtle);
    border-left: 1px solid var(--qt-stroke-subtle);
    opacity: 0.90;
  }
</style>
