<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
  import DocBrowserHtmlViewToolbar from './DocBrowserHtmlViewToolbar.svelte';

  const page = $derived(ui.history.currentEntry);

  $effect(() => {
    if (page?.anchor) {
      viewlogic.scrollToAnchor(page.anchor);
    }
  });
</script>

<div class='w-full flex flex-col gap-1.5'>
  <div class='h-[32px]'></div>
  <DocBrowserHtmlViewToolbar />
  <iframe
    bind:this={ui.iframeEl}
    data-role='viewer'
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
  [data-role='viewer'] {
    overflow: hidden;
  }
</style>
