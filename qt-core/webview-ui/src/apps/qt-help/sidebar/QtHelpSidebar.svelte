<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  // import { clickOutside, portal, placeNear } from '@/utils/actions';

  import QtHelpTocView from './QtHelpTocView.svelte';
  import QtHelpIndexView from './QtHelpIndexView.svelte';
  import QtHelpSearchResultView from './QtHelpSearchResultView.svelte';
  import QtHelpSidebarToolbar from './QtHelpSidebarToolbar.svelte';
  // import DocBrowserQtVersionPopover from './DocBrowserQtVersionPopover.svelte';

  import { ui } from '../states.svelte';

  // const popover = $derived(ui.popovers.qtVersions);

</script>

<div class="h-full flex flex-col gap-1.5">
  <QtHelpSidebarToolbar />

  {#if ui.mode === 'index'}
    <QtHelpIndexView />
  {:else if ui.mode === 'text'}
    <QtHelpSearchResultView />
  {:else}
    <QtHelpTocView />
  {/if}

  <!-- {#if popover.visible}
    <div
      use:portal
      use:placeNear={{
        ref: popover.refEl,
        placement: 'bottom-start',
        offset: 5
      }}
      use:clickOutside={(e: MouseEvent) => {
        popover.visible = false;
        e.stopPropagation();
      }}
      class="fixed z-1"
    >
      <DocBrowserQtVersionPopover />
    </div>
  {/if} -->
</div>
