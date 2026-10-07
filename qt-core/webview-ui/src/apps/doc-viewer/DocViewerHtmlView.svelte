<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';

  import Popover from './others/Popover.svelte';
  import DocViewerErrorPage from './DocViewerErrorPage.svelte';
  import DocViewerFindPopover from './DocViewerFindPopover.svelte';
  import DocViewerContextMenu from './DocViewerContextMenu.svelte';

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
  {#if ui.iframe.errorCode}
    <DocViewerErrorPage />
  {:else}
    <iframe
      bind:this={ui.iframe.el}
      title='viewer'
      class='w-full h-full'
      src={ui.iframe.src}
      allow='clipboard-write'
    ></iframe>
  {/if}

  {#if popover.visible}
    <Popover
      reference={popover.refEl}
      placement='bottom'
      offset={5}
      onClose={() => {
        popover.visible = false;
      }}
    >
      <DocViewerFindPopover />
    </Popover>
  {/if}

  {#if ui.popovers.contextMenu.visible}
    <Popover
      reference={virtualRef}
      placement='bottom-start'
    >
      <DocViewerContextMenu />
    </Popover>
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
