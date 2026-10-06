<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import QtBrowserHistoryList from './QtBrowserHistoryList.svelte';
  import QtBrowserHistoryToolbar from './QtBrowserHistoryToolbar.svelte';
</script>

<div class='w-full h-full flex flex-col gap-2 pl-4 py-2'>
  <span data-role='title'>
    History
  </span>

  <QtBrowserHistoryToolbar />
  <QtBrowserHistoryList />
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
