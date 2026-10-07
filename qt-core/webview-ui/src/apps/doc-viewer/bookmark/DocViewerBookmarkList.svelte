<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import CheckBox from '@/comps/CheckBox.svelte';
  import Separator from '@/comps/Separator.svelte';
  import { data } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  let dragIndex = $state<number | null>(null);
  let overIndex = $state<number | null>(null);

  function clear() {
    dragIndex = null;
    overIndex = null;
  }

  function dndHandlers(i: number) {
    return {
      ondragstart: (e: DragEvent) => {
        dragIndex = i;
        e.dataTransfer!.effectAllowed = 'move';
      },

      ondragover: (e: DragEvent) => {
        e.preventDefault();
        overIndex = i;
      },

      ondrop: () => {
        if (dragIndex !== null && dragIndex !== i) {
          viewlogic.bookmark.edit({
            action: 'move',
            from: dragIndex,
            to: i
          });
        }
        clear();
      },

      ondragend: clear
    };
  }

</script>

<div class='qt-item-list w-full flex flex-col items-center'>
  {#each data.bookmarks as item, i (i)}
    {#if i !== 0}
      <Separator />
    {/if}

    <div
      role='listitem'
      class='w-full flex flex-row items-center'
      class:drop-target={overIndex === i}
      draggable={true}
      {...dndHandlers(i)}
    >
      <CheckBox bind:checked={item.checked} />

      <button
        class='item grow flex flex-row items-center gap-2'
        class:active={item.checked}
        onclick={() => {
          viewlogic.openUri(item.data.uri);
          viewlogic.setLayerVisible('bookmark', false);
        }}
      >
        <span data-role='title'>{item.data.title}</span>
      </button>
    </div>
  {/each}
</div>

<style>
  .drop-target {
    box-shadow: inset 0 2px 0 var(--vscode-focusBorder);
  }

  [data-role='title'] {
    min-width: 0;
    flex-shrink: 0;
    color: var(--qt-text-default);
  }
</style>
