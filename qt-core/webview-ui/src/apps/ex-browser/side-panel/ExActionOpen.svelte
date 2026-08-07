<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as icons from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<button
  bind:this={ui.popovers.openExample.refEl}
  data-variant={!ui.sideBar.expanded ? 'primary' : 'secondary'}
  data-active={ui.popovers.openExample.visible}
  class='qt-button flex flex-row items-center'
  onclick={() => {
    viewlogic.setPopoverVisible('openExample', true);
  }}
>
  <icons.FolderOpen />
  Open example
</button>

<style>
  .qt-button {
    border: none;

    &[data-active='true'] {
      background: var(--qt-button-primary-hover);
    }
  }
</style>
