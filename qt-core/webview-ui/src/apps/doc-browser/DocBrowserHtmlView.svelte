<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { ViewerActionId } from '@shared/doc-browser';
  import DocBrowserHtmlViewToolbar from './DocBrowserHtmlViewToolbar.svelte';

  const info = $derived(ui.history.currentEntry);

  function scrollToAnchor() {
    const anchor = info?.anchor;
    if (anchor) {
      viewlogic.postToViewer(ViewerActionId.ScrollToAnchor, { anchor });
    }
  }

  $effect(() => {
    void info?.anchor;
    scrollToAnchor();
  });
</script>

<div data-role='area' class='w-full flex flex-col'>
  <DocBrowserHtmlViewToolbar />
  <iframe
    bind:this={ui.iframeEl}
    class='grow min-w-0 overflow-y-auto'
    title={info?.title}
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
