<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import LoadingMask from '@/comps/LoadingMask.svelte';

  import QtHelpTocView from '../views/QtHelpTocView.svelte';
  import QtHelpIndexView from '../views/QtHelpIndexView.svelte';
  import QtHelpSearchResultView from '../views/QtHelpSearchResultView.svelte';
  import QtHelpSidebarToolbar from './QtHelpSidebarToolbar.svelte';
  import { ui } from '../states.svelte';

</script>

<div class="h-full flex flex-col select-none">
  <QtHelpSidebarToolbar />

  <div class='w-full flex flex-row overflow-hidden h-full relative'>
    <div data-role='view' class='grow truncate'>
      {#if ui.mode === 'index'}
        <QtHelpIndexView />
      {:else if ui.mode === 'text'}
        <QtHelpSearchResultView />
      {:else}
        <QtHelpTocView />
      {/if}

      {#if ui.task.busy}
        <LoadingMask
          busy={true}
          error={ui.task.error}
          layout='col'
          forceHidden={ui.task.isDebouncing}
          busyText='Searching...'
          closeText='Close'
        />
      {/if}
    </div>
  </div>
</div>

<style>
  [data-role='view'] {
    border-right: 1px solid var(--qt-stroke-subtle);
  }
</style>
