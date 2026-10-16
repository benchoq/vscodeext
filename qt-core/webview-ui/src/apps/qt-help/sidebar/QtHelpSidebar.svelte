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
  import { isUiTaskName } from '../types.svelte';

  const busyText = $derived.by(() => {
    const name_s = ui.task.recentOptions?.name ?? '';
    if (isUiTaskName(name_s) && (name_s === 'search')) {
      return 'Searching...';
    }

    return 'Loading...';
  })
</script>

<div data-role='view' class="h-full flex flex-col select-none">
  <QtHelpSidebarToolbar />

  <div class='w-full h-full flex flex-row overflow-hidden relative'>
    <div class='grow truncate'>
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
          busyText={busyText}
          closeText='Close'
        />
      {/if}
    </div>
  </div>
</div>

<style>
  [data-role='view'] {
    background: var(--qt-bg-subtle);
    border-right: 1px solid var(--qt-stroke-subtle);
  }
</style>
