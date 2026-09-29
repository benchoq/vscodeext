<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import { clickOutside, portal, placeNear } from '@/utils/actions';
  import QtBrowserFindPopover from './QtBrowserFindPopover.svelte';

  function onLoad() {
    console.log('onLoad', ui.iframe.el?.contentWindow?.location);
  }

   const popover = $derived(ui.popovers.find);
</script>

<div class='w-full h-full relative'>
  <iframe
    bind:this={ui.iframe.el}
    title='viewer'
    class='w-full h-full'
    src={ui.iframe.src}
    onload={onLoad}
  >

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
        <QtBrowserFindPopover />
      </div>
    {/if}
  </iframe>
</div>
