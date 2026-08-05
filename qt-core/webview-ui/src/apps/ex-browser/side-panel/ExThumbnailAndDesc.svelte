<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  const example = $derived(ui.selected.example);
</script>

<div data-area='side-panel'>
  <div data-thumbnail>
    <ExThumbnail {example} />
  </div>
  <div data-role='name'>{example?.name ?? ''}</div>
  <div data-role='desc'>{example?.description}</div>
</div>

<style>
  [data-role='name'],
  [data-role='desc'] {
    margin: 0 0 12px;
    color: var(--qt-text-default);
  }

  [data-thumbnail] {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--qt-radius-m);
    overflow: hidden;
    background: var(--qt-bg-default);
    margin-bottom: 12px;
    position: relative;
    align-items: stretch;
  }
</style>
