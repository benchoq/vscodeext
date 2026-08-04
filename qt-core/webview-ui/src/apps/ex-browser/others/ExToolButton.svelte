<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang='ts'>
  import { type Snippet } from 'svelte';

  let {
    size = '20px',
    children = undefined as (Snippet | undefined),
    onClicked = (_: MouseEvent) => {}
  } = $props();
</script>

<button
  data-comp-root
  class='flex items-center justify-center'
  style:width={size}
  style:height={size}
  onclick={(e: MouseEvent) => onClicked(e)}
>
  {@render children?.()}
</button>

<style>
  [data-comp-root] {
    color: var(--qt-text-muted);
    border-radius: var(--qt-radius-s);
    font-size: 20px;
    font-weight: 200;
    line-height: 1;
    cursor: pointer;
    transition: background var(--duration-short);

    &:hover {
      color: var(--qt-text-default);
      background: var(--qt-icon-hover-bg);
    }
  }
</style>
