<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Folder, FileTag } from '@/icons';

  import { ui } from './states.svelte';
  import Column from '@/comps/Column.svelte';

  const example = $derived(ui.selected.example);
</script>

<Column>
  <button class='action-wrapper'>
    <FileTag size={14} />
    <div>CMakeLists.txt</div>
    <span class="detail-link-arr">›</span>
  </button>

  <button class='action-wrapper'>
    <Folder size={14} />
    <div>Show in Finder</div>
    <span class="detail-link-arr">›</span>
  </button>
</Column>

<style>
  :global(.action-wrapper) {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    /* padding: 5px 2px; */
    background: none;
    border: none;
    color: var(--qt-text-muted);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    border-radius: 3px;
    transition: color 80ms;
  }

  :global(.action-wrapper:hover) {
    color: var(--qt-accent-info);
  }

  :global(.detail-link-arr) {
    margin-left: auto;
    opacity: 0.5;
    font-size: 14px;
  }
</style>
