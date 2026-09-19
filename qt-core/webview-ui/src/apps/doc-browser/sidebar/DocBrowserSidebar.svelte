<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { clickOutside, portal, placeNear } from '@/utils/actions';

  import DocBrowserTocView from './DocBrowserTocView.svelte';
  import DocBrowserIndexView from './DocBrowserIndexView.svelte';
  import DocBrowserSearchResultView from './DocBrowserSearchResultView.svelte';
  import DocBrowserSidebarToolbar from './DocBrowserSidebarToolbar.svelte';
  import DocBrowserQtVersionPopover from './DocBrowserQtVersionPopover.svelte';

  import { ui } from '../states.svelte';

  const popover = $derived(ui.popovers.qtVersions);

</script>

<div class="h-full flex flex-col gap-1.5">
  <DocBrowserSidebarToolbar />

  {#if ui.mode === 'index'}
    <DocBrowserIndexView />
  {:else if ui.mode === 'text'}
    <DocBrowserSearchResultView />
  {:else}
    <DocBrowserTocView />
  {/if}

  {#if popover.visible}
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
  {/if}
</div>
