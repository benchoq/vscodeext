<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';

  function onLoad() {
    console.log('loaded', ui.iframe.el?.src);
  }
</script>

<iframe
  bind:this={ui.iframe.el}
  title='viewer'
  class='w-full h-full'
  src={ui.iframe.src}
  onload={onLoad}
>
</iframe>
