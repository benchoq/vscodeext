<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import DocBrowserHtmlViewToolbar from './DocBrowserHtmlViewToolbar.svelte';

  const index = $derived(ui.selected.index);

  function scrollToAnchor() {
    const anchor = index?.anchor;
    if (anchor && ui.iframeEl?.contentWindow) {
      ui.iframeEl.contentWindow.postMessage({
        type: 'docbrowser-scroll-to-anchor',
        anchor
      }, '*');
    }
  }

  $effect(() => {
    void index?.anchor;
    scrollToAnchor();
  });
</script>

<div data-role='area' class='w-full flex flex-col'>
  <DocBrowserHtmlViewToolbar />
  <iframe
    bind:this={ui.iframeEl}
    class='grow min-w-0 overflow-y-auto'
    title={index?.title}
    src={ui.selected.htmlUri}
    onload={scrollToAnchor}
  >
  </iframe>
</div>

<style>
  [data-role='area'] {
    border: 1px solid #333333;
    overflow: hidden;
  }
</style>
