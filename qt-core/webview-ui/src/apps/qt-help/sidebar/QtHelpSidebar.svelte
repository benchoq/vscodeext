<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import QtHelpTocView from './QtHelpTocView.svelte';
  import QtHelpIndexView from './QtHelpIndexView.svelte';
  import QtHelpSearchResultView from './QtHelpSearchResultView.svelte';
  import QtHelpSidebarToolbar from './QtHelpSidebarToolbar.svelte';
  import QtHelpSidebarHandle from './QtHelpSidebarHandle.svelte';
  import { ui } from '../states.svelte';

</script>

<div class="h-full flex flex-col">
  <QtHelpSidebarToolbar />

  <div class='w-full flex flex-row overflow-hidden h-full'>
    <div data-role='view' class='grow truncate'>
      {#if ui.mode === 'index'}
        <QtHelpIndexView />
      {:else if ui.mode === 'text'}
        <QtHelpSearchResultView />
      {:else}
        <QtHelpTocView />
      {/if}
    </div>

    <QtHelpSidebarHandle />
  </div>
</div>

<style>
  [data-role='view'] {
    border-right: 1px solid var(--qt-stroke-subtle);
  }
</style>
