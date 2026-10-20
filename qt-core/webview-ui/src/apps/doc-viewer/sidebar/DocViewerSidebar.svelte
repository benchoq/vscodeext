<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Snippet } from 'svelte';

  import CloseButton from '@/comps/CloseButton.svelte';
  import VerticalResizeHandle from '@/comps/VerticalResizeHandle.svelte';
  import DocViewerBookmarkList from '../bookmark/DocViewerBookmarkList.svelte';
  import DocViewerBookmarkToolbar from '../bookmark/DocViewerBookmarkToolbar.svelte';
  import DocViewerHistoryList from '../history/DocViewerHistoryList.svelte';
  import DocViewerHistoryToolbar from '../history/DocViewerHistoryToolbar.svelte';

  import * as viewlogic from '../viewlogic.svelte';
  import { ui } from '../states.svelte';

  let info = $derived.by(() => {
    if (ui.sidePanel.mode === 'bookmark') {
      return {
        title: 'Bookmarks',
        toolbar: DocViewerBookmarkToolbar as Snippet,
        content: DocViewerBookmarkList as Snippet
      }
    } else {
      return {
        title: 'History',
        toolbar: DocViewerHistoryToolbar as Snippet,
        content: DocViewerHistoryList as Snippet
      }
    }
  });

</script>

<div data-area='side-panel' class='w-full h-full'>
  {@render resizeHandle()}

  {#if ui.sidePanel.mode}
    <div class='w-full h-full flex flex-col'>
      {@render header()}

      <div data-role='content' class='h-full flex flex-col'>
        {@render info.toolbar()}
        {@render info.content()}
      </div>
    </div>
  {/if}
</div>

<!-- snippets -->
{#snippet header()}
  <div data-role='header' class='flex flex-row items-center'>
    <span data-role='title'>{info.title}</span>
    <CloseButton
      onClicked={() => {
        viewlogic.setSidePanel(undefined);
      }}
    />
  </div>
{/snippet}

{#snippet resizeHandle()}
  <div class='absolute h-full left-0 top-0'>
    <VerticalResizeHandle
      bind:width={ui.sidePanel.width}
      grow='left'
    />
  </div>
{/snippet}

<style>
  [data-area='side-panel'] {
    background: var(--qt-bg-subtle);
    border-left: 1px solid var(--qt-stroke-subtle);
    opacity: 0.95;
  }

  [data-role='header'] {
    gap: 6px;
    padding: 10px;
    background: var(--qt-bg-default);
    border-bottom: solid 1px var(--qt-stroke-subtle);
  }

  [data-role='title'] {
    flex: 1;
    color: var(--qt-text-default);
    font-weight: bold;
    font-size: var(--qt-font-m);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  [data-role='content'] {
    gap: 6px;
    overflow: auto;
    padding-left: calc(var(--spacing) * 2);
  }
</style>
