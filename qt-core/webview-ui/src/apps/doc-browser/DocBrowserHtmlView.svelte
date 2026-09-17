<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import DocBrowserHtmlViewToolbar from './DocBrowserHtmlViewToolbar.svelte';

  const page = $derived(ui.history.currentEntry);

  $effect(() => {
    if (page?.anchor) {
      viewlogic.scrollToAnchor(page.anchor);
    }
  });
</script>

<div data-role='area' class='w-full flex flex-col'>
  <DocBrowserHtmlViewToolbar />
  <iframe
    bind:this={ui.iframeEl}
    class='grow min-w-0 overflow-y-auto'
    title={page?.title}
    src={ui.selected.htmlUri}
    onload={() => {
      viewlogic.scrollToAnchor(page?.anchor);
    }}
  >
  </iframe>
</div>

<style>
  [data-role='area'] {
    border: 1px solid #333333;
    overflow: hidden;
  }
</style>
