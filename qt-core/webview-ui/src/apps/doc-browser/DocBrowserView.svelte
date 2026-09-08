<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';

  const entry = $derived(ui.selected.entry);
  let iframeEl: HTMLIFrameElement;

  function scrollToAnchor() {
    const anchor = entry?.anchor;
    if (anchor && iframeEl.contentDocument) {
      const target = iframeEl.contentDocument.getElementById(anchor);
      target?.scrollIntoView();
    }
  }

  $effect(() => {
    void entry?.anchor;
    scrollToAnchor();
  });
</script>

<div data-role='area' class='w-full flex flex-col'>
  <div class='p-2 flex flex-row'>
    <span class='grow'>{entry?.fileTitle}</span>
    <span>{entry?.folderName}/{entry?.fileName}</span>
  </div>
  <iframe
    bind:this={iframeEl}
    class='grow min-w-0 overflow-y-auto'
    title={entry?.fileTitle}
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
