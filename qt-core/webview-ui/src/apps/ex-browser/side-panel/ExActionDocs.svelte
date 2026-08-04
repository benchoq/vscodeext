<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExToolButton from '../others/ExToolButton.svelte';
  import { FileTag, ExtLink } from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-row items-center justify-center'>
  <button
    data-button
    class='flex flex-row grow'
    onclick={() => {
      viewlogic.runExAction('doc-open-internal');
    }}
  >
    <FileTag />
    <span class='flex-1'>Read the documentation</span>

    <ExToolButton
      onClicked={(e: MouseEvent) => {
        e.stopPropagation();
        viewlogic.runExAction('doc-open-external');
      }}
    >
      <ExtLink size={12}/>
    </ExToolButton>
  </button>
</div>

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

    &[data-flat] {
      color: var(--qt-text-muted);
      background: none;
      padding: 5px 2px;

      &:hover {
        color: var(--qt-accent-info);
      }
    }
  }
</style>
