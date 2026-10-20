<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component } from 'svelte';
  import { Bookmark, Clock } from '@lucide/svelte';

  import CloseButton from '@/comps/CloseButton.svelte';
  import VerticalResizeHandle from '@/comps/VerticalResizeHandle.svelte';
  import DocViewerHistoryList from './DocViewerHistoryList.svelte';
  import DocViewerBookmarkList from './DocViewerBookmarkList.svelte';
  import DocViewerSidebarToolbar from './DocViewerSidebarToolbar.svelte';

  import * as viewlogic from '../viewlogic.svelte';
  import { ui } from '../states.svelte';

  const bookmark = $derived(ui.sidePanel.mode === 'bookmark');
</script>

<div data-area='sidebar' class='w-full h-full'>
  {@render resizeHandle()}

  <div class='w-full h-full flex flex-col'>
    {@render header(
      bookmark ? Bookmark : Clock,
      bookmark ? 'Bookmarks' : 'History'
    )}

    <div data-role='content' class='h-full flex flex-col'>
      <DocViewerSidebarToolbar mode={ui.sidePanel.mode} />
      {#if bookmark}
        <DocViewerBookmarkList />
      {:else}
        <DocViewerHistoryList />
      {/if}
    </div>
  </div>
</div>

<!-- snippets -->
{#snippet header(Icon: Component, title: string)}
  <div data-role='header' class='flex flex-row items-center'>
    <Icon />
    <span data-role='title'>{title}</span>
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
  [data-area='sidebar'] {
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
