<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { data, ui } from '../states.svelte';
  import TocTreeViewNode from '../others/TocTreeViewNode.svelte';
</script>

<div
  data-role='area'
  class='flex flex-col'
>
  <div class='qt-item-list flex flex-col h-full'>
    {#each ui.tocTree.topLevels as node (node.id)}
    <TocTreeViewNode {node} />
    {/each}
  </div>

  <span class='p-2'>
    Total {data.toc.length} entries
  </span>
</div>

<style>
  [data-role='area'] {
    border: 1px solid #333333;
    height: 100%;
    min-height: 0;
    overflow: auto;
  }
</style>
