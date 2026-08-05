<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as viewlogic from '../../viewlogic.svelte';
</script>

<div data-comp-root class='flex flex-row'>
  <div data-role='title'>Catalog</div>
  <button
    data-close-button
    onclick={() => {
      viewlogic.setPopoverVisible('catalog', false);
    }}
  >
    &times;
  </button>
</div>

<style>
  [data-role='title'] {
    color: var(--qt-text-default);
  }

  [data-comp-root] {
    padding: 10px 14px;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  [data-close-button] {
    background: none;
    border: none;
    color: var(--qt-text-muted);
    font-size: 20px;
    font-weight: 200;
    cursor: pointer;
    padding: 0px 4px 2px;
    border-radius: var(--qt-radius-s);
    line-height: 1;
    transition-property: color, background;
    transition-duration: var(--duration-short);

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-icon-hover-bg);
    }
  }
</style>
