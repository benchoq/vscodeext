<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import QtBrowserBookmarkList from './QtBrowserBookmarkList.svelte';
  import QtBrowserBookmarkToolbar from './QtBrowserBookmarkToolbar.svelte';

</script>

<div class='w-full h-full flex flex-col gap-2 px-4 py-2'>
  <span data-role='title'>
    Bookmarks
  </span>

  <QtBrowserBookmarkToolbar />
  <QtBrowserBookmarkList />
</div>

<style>
  [data-role='title'] {
    color: var(--qt-text-muted);
    font-weight: bold;
    font-size: var(--qt-font-s);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
</style>
