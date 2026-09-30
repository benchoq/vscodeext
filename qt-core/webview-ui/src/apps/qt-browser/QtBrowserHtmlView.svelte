<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import { clickOutside, portal, placeNear } from '@/utils/actions';
  import QtBrowserFindPopover from './QtBrowserFindPopover.svelte';

  const popover = $derived(ui.popovers.find);
</script>

<div class='w-full h-full relative'>
  <iframe
    bind:this={ui.iframe.el}
    title='viewer'
    class='w-full h-full'
    src={ui.iframe.src}
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

  {#if ui.iframe.hoveredUri.length !== 0}
    <span data-role='hover-link' class='absolute'>
      {ui.iframe.hoveredUri}
    </span>
  {/if}
</div>

<style>
  [data-role='hover-link'] {
    left: 0;
    bottom: 0;
    padding: 1px 5px;
    opacity: 0.9;
    border: 1px solid gray;
    color: var(--vscode-editor-foreground);
    background-color: var(--vscode-editor-background);
  }
</style>
