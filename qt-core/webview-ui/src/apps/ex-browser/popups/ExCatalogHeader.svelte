<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from '../viewlogic.svelte';

</script>

<div class='header flex flex-row'>
  <div class='header-title'>Catalog</div>
  <div class='grow'></div>
  <button
    class='header-close'
    onclick={() => {
      viewlogic.setOverlayVisible('catalog', false);
    }}
  >
    x
  </button>
</div>

<style>
  .header {
    padding: 10px 14px;
    border-bottom: 1px solid var(--qt-stroke-subtle);

    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .header-title {
    color: var(--qt-text-default);
    font-size: 13px;
    font-weight: 600;
  }

  .header-close {
    padding: 2px 4px;

    color: var(--qt-text-muted);
    background: none;
    border: none;
    border-radius: var(--qt-radius-s);

    font-size: 14px;
    line-height: 1;

    cursor: pointer;
    transition:
      color var(--qt-duration-fast),
      background var(--qt-duration-fast);
  }

  .header-close:hover {
    color: var(--qt-text-default);
    background: var(--qt-icon-hover-bg);
  }
</style>
