<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ChevronRight } from '@/icons';

</script>

<button
  data-button
  class='flex flex-row'
  onclick={() => {
  }}
>
  <ChevronRight size={14} />
  Use as a template
</button>

<style>
 [data-button] {
    align-items: center;
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
    text-align: left;

    &:hover {
      background: var(--qt-button-secondary-hover);
    }
  }
</style>
