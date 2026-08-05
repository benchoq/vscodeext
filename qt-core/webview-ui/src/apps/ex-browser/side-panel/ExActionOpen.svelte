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
  data-active={ui.popovers.openExample.visible}
  class='qt-button flex flex-row items-center justify-center'
  onclick={() => {
    viewlogic.setPopoverVisible('openExample', true);
  }}
>
  Open example
</button>

<style>
  .qt-button {
    height: 30px;
    border: none;

    &[data-active='true'] {
      background: var(--qt-button-primary-hover);
    }
  }
</style>
