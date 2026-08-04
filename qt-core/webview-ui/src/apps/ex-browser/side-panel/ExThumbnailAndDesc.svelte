<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  const example = $derived(ui.selected.example);
</script>

<div data-info>
  <div data-thumbnail>
    <ExThumbnail {example} />
  </div>
  <div data-name>{example?.name ?? ''}</div>
  <div data-desc>{example?.description}</div>
</div>

<style>
  [data-info] {
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

    & > [data-name] {
      font-size: 14px;
      font-weight: 600;
      color: var(--qt-text-default);
      margin: 0 0 12px;
      line-height: 1.35;
    }

    & > [data-desc] {
      font-size: 12px;
      color: var(--qt-text-default);
      line-height: 1.6;
      margin: 0 0 12px;
    }
  }
</style>
