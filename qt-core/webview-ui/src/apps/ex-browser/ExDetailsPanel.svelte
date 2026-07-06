<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from './states.svelte';
</script>

<div class={`
  panel ${ui.overlays.details.visible ? 'open' : ''}
  bg-blue-400
`}>
  <button
    onclick={() => {
      ui.overlays.details.visible = false;
    }}
  >
    close
  </button>
</div>

<style>
  :global(.panel) {
    width: 0;
    flex-shrink: 0;
    overflow: hidden;
    border-left: 1px solid transparent;
    background: var(--qt-bg-subtle);
    transition: width 220ms cubic-bezier(.4,0,.2,1), border-color 220ms;
    display: flex;
    flex-direction: column;
  }

  :global(.panel.open) {
    width: 320px;
    border-left-color: var(--qt-stroke-subtle);
  }

  :global(.panel-inner) {
    width: 320px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    padding: 12px 14px 24px;
  }
</style>
