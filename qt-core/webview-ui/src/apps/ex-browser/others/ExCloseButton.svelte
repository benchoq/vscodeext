<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang='ts'>
  let {
    onClicked = () => {}
  } = $props();
</script>

<button
  data-close-button
  onclick={() => onClicked()}
>
  &times;
</button>

<style>
  [data-close-button] {
    width: 20px;
    height: 20px;
    color: var(--qt-text-muted);
    cursor: pointer;
    border-radius: var(--qt-radius-s);
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 200;
    padding: 0;
    line-height: 1;
    display: inline-block;
    transition: background var(--duration-short);

    &:hover {
      background: var(--qt-icon-hover-bg);
      color: var(--qt-text-default);
    }
  }
</style>
