<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';

  const index = $derived(ui.selected.index);
  let iframeEl: HTMLIFrameElement;

  function scrollToAnchor() {
    const anchor = index?.anchor;
    if (anchor && iframeEl.contentDocument) {
      const target = iframeEl.contentDocument.getElementById(anchor);
      target?.scrollIntoView();
    }
  }

  const title = $derived(ui.mode === 'toc' ? ui.selected.toc?.title : ui.selected.index?.fileTitle);
  const htmlInfo = $derived(ui.mode === 'toc' ? ui.selected.toc?.href : ui.selected.index?.fileName)

  $effect(() => {
    void index?.anchor;
    scrollToAnchor();
  });
</script>

<div data-role='area' class='w-full flex flex-col'>
  <div class='p-2 flex flex-row'>
    <span class='grow'>{title}</span>
    <span>{htmlInfo}</span>
  </div>
  <iframe
    bind:this={iframeEl}
    class='grow min-w-0 overflow-y-auto'
    title={index?.fileTitle}
    srcdoc={ui.selected.html}
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
