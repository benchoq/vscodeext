<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { clickOutside, portal, placeNear } from '@/utils/actions';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import DocBrowserFindPopover from './DocBrowserFindPopover.svelte';
  import DocBrowserHtmlViewToolbar from './DocBrowserHtmlViewToolbar.svelte';

  const page = $derived(ui.history.currentEntry);
  const popover = $derived(ui.popovers.find);

  $effect(() => {
    if (page?.anchor) {
      viewlogic.scrollToAnchor(page.anchor);
    }
  });
</script>

<div class='w-full flex flex-col gap-1.5'>
  <DocBrowserHtmlViewToolbar />

  <iframe
    bind:this={ui.iframeEl}
    data-role='viewer'
    class='grow min-w-0 overflow-y-auto'
    title={page?.title}
    src={ui.selected.htmlUri}
    onload={() => {
      viewlogic.scrollToAnchor(page?.anchor);
    }}
  >
  </iframe>

  {#if popover.visible}
    <div
      use:portal
      use:placeNear={{
        ref: popover.refEl,
        placement: 'bottom-end',
        offset: 5
      }}
      use:clickOutside={(e: MouseEvent) => {
        popover.visible = false;
        e.stopPropagation();
      }}
      class="fixed z-1"
    >
      <DocBrowserFindPopover />
    </div>
  {/if}
</div>

<style>
  [data-role='viewer'] {
    overflow: hidden;
  }
</style>
