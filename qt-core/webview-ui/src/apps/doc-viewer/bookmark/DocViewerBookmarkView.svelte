<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Bookmark } from "@lucide/svelte";

  import CloseButton from '@/comps/CloseButton.svelte';
  import DocViewerBookmarkList from './DocViewerBookmarkList.svelte';
  import DocViewerBookmarkToolbar from './DocViewerBookmarkToolbar.svelte';
  import * as viewlogic from '../viewlogic.svelte';

</script>

<div class='w-full h-full flex flex-col'>
  <div data-role='title' class='flex flex-row items-center'>
    <Bookmark />
    <span data-role='title-text'>Bookmarks</span>
    <CloseButton
      onClicked={() => {
        viewlogic.setSidePanel(undefined);
      }}
    />
  </div>

  <div data-role='content' class='h-full flex flex-col'>
    <DocViewerBookmarkToolbar />
    <DocViewerBookmarkList />
  </div>
</div>

<style>
  [data-role='title'] {
    gap: 6px;
    padding: 10px;
    background: var(--qt-bg-default);
    border-bottom: solid 1px var(--qt-stroke-subtle);
  }

  [data-role='title-text'] {
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
