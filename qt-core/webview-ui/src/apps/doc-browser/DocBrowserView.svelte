<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';

  let iframeEl: HTMLIFrameElement;

  function scrollToAnchor() {
    const anchor = ui.selected.entry?.anchor;
    if (anchor && iframeEl.contentDocument) {
      const target = iframeEl.contentDocument.getElementById(anchor);
      target?.scrollIntoView();
    }
  }

  $effect(() => {
    void ui.selected.entry?.anchor;
    scrollToAnchor();
  });
</script>

<iframe
  bind:this={iframeEl}
  class='grow'
  title={ui.selected.entry?.fileTitle}
  srcdoc={ui.selected.html}
  onload={scrollToAnchor}
>
</iframe>
