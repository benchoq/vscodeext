<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { SquareMinus } from '@lucide/svelte';

  import { countAsLocaleString } from '@/utils/format';
  import { data, ui } from '../states.svelte';
  import QtHelpTocTreeNode from './QtHelpTocTreeNode.svelte';

  const collapsible = $derived(ui.tocTree.expandedState !== 'empty');
</script>

<div
  data-role='area'
  class='flex flex-col h-full'
>
  <div data-role='header' class='flex flex-row gap-1'>
    <span class='w-full items-center self-center'>
      Table of contents
    </span>

    <div class='grow'></div>

    <button
      data-role='collapse'
      class='qt-button'
      style:visibility={collapsible ? 'visible' : 'hidden'}
      disabled={!collapsible}
      onclick={() => {
        ui.tocTree.setExpandedAll(false);
      }}
    >
      <SquareMinus />
    </button>
  </div>

  <div class='qt-item-list h-full flex flex-col'>
    {#each ui.tocTree.topLevels as node (node.id)}
      <QtHelpTocTreeNode {node} />
    {/each}
  </div>

  <span data-role='status' class='w-full text-right'>
    Total {countAsLocaleString(data.toc.length)} entries
  </span>
</div>

<style>
  [data-role='area'] {
    min-height: 0;
    overflow: auto;
  }

  [data-role='header'] {
    padding: 5px 5px 5px 10px;
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }

  [data-role='collapse'] {
    border: none;
    background: none;
  }

  [data-role='status'] {
    padding: 5px 10px;
    background: var(--qt-bg-subtle);
    border-top: 1px solid var(--qt-stroke-subtle);
  }
</style>
