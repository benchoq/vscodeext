<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import { clickOutside, portal, placeNear } from '@/utils/actions';
  import QtBrowserFindPopover from './QtBrowserFindPopover.svelte';
  import QtBrowserContextMenu from './QtBrowserContextMenu.svelte';

  const popover = $derived(ui.popovers.find);

  const pos = $derived(ui.popovers.contextMenu.pos);
  const virtualRef = $derived(pos
    ? {
        getBoundingClientRect: () => ({
          x: pos.x, y: pos.y,
          top: pos.y, left: pos.x,
          right: pos.x, bottom: pos.y,
          width: 0, height: 0,
        }),
      }
    : undefined
  );

</script>

<div class='w-full h-full relative'>
  <iframe
    bind:this={ui.iframe.el}
    title='viewer'
    class='w-full h-full'
    src={ui.iframe.src}
  ></iframe>

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
      class="z-1"
    >
      <QtBrowserFindPopover />
    </div>
  {/if}

  {#if ui.popovers.contextMenu.visible}
    <div
      use:portal
      use:placeNear={{
        ref: virtualRef,
        placement: 'bottom-start',
        offset: 0
      }}
    >
      <QtBrowserContextMenu />
    </div>
  {/if}

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
