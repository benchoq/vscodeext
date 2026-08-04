<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<button
  bind:this={ui.popovers.openExample.refEl}
  data-variant='primary'
  class='qt-button-v2 flex flex-row items-center justify-center'
  style:height='31px'
  onclick={() => {
    viewlogic.setPopoverVisible('openExample', true);
  }}
>
  Open example
</button>
