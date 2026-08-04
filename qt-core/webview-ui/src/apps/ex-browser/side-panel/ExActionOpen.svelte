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
  data-button
  data-primary
  class='flex flex-row items-center justify-center'
  style:height='31px'
  onclick={() => {
    viewlogic.setPopoverVisible('openExample', true);
  }}
>
  Open example
</button>

<style>
  [data-button] {
    gap: 7px;
    padding: 5px 11px;
    color: var(--qt-button-secondary-fg);
    background: var(--qt-button-secondary-bg);
    border: none;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      background: var(--qt-button-secondary-hover);
    }

    &[data-primary] {
      color: var(--qt-button-fg);
      background: var(--qt-button-primary-bg);

      &:hover {
        background: var(--qt-button-primary-hover);
      }
    }
  }
</style>
