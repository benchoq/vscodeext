<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import * as helpers from './helpers';

  import DocViewerErrorPage from './DocViewerErrorPage.svelte';
  import DocViewerEmptyPage from './DocViewerEmptyPage.svelte';
  import DocViewerFindPopover from './DocViewerFindPopover.svelte';
  import DocViewerContextMenu from './DocViewerContextMenu.svelte';
  import DocViewerHtmlViewMask from './DocViewerHtmlViewMask.svelte';
</script>

<div class='w-full h-full relative'>
  {#if ui.iframe.errorCode}
    <DocViewerErrorPage />
  {:else if ui.iframe.uri.length === 0}
    <DocViewerEmptyPage />
  {:else}
    <iframe
      bind:this={ui.iframe.el}
      title='viewer'
      class='w-full h-full'
      src={ui.iframe.uri}
      allow='clipboard-write'
    ></iframe>
  {/if}

  <DocViewerHtmlViewMask />
  <DocViewerFindPopover />
  <DocViewerContextMenu />

  {#if ui.iframe.hoveredUri}
    <span data-role='hover-uri' class='absolute'>
      {helpers.toFileUriIfServer(ui.iframe.hoveredUri)}
    </span>
  {/if}
</div>

<style>
  [data-role='hover-uri'] {
    left: 5;
    bottom: 0;
    padding: 1px 5px;
    border: 1px solid var(--qt-stroke-subtle);
    color: var(--qt-text-muted);
    background: var(--qt-bg-subtle);
  }
</style>
