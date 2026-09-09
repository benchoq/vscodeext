<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { icons } from '@/symbols';
  import TocTreeViewNode from './TocTreeViewNode.svelte';
  import type { TocTreeNode } from '../types.svelte';
  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  interface Props {
    node: TocTreeNode;
  }

  let { node }: Props = $props();

  const hasChildren = $derived(node.children.length !== 0);
  const expanded = $derived(ui.tocTree.expanded(node.id));
</script>

<button
  class='item flex align-start'
  class:active={ui.selected.toc === node.data}
  onclick={() => {
    ui.tocTree.toggleExpanded(node.id);
    viewlogic.openDocFromToc(node.data);
  }}
>
  <span
    style:margin-left={`${node.data.depth * 10}px`}
    class='flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis'
  >
    {@render chevron(node, expanded)}
    {node.data.title}
  </span>
</button>

{#if hasChildren && expanded}
  {#each node.children as child (child.id)}
    <TocTreeViewNode node={child} />
  {/each}
{/if}

{#snippet chevron(node: TocTreeNode, expanded: boolean)}
  <div class='w-[16px] flex'>
    {#if node.children.length !== 0}
      <button
        data-chevron
        class='self-center'
        style:transform={expanded ? 'rotate(90deg)' : 'rotate(0deg)'}
        onclick={(e: MouseEvent) => {
          ui.tocTree.toggleExpanded(node.id);
          e.stopPropagation();
        }}
      >
        <icons.ChevronRight size={16} />
      </button>
    {/if}
  </div>
{/snippet}
