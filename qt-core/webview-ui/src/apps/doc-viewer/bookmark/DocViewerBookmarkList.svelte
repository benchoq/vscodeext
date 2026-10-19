<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Check } from '@lucide/svelte';
  import CheckBox from '@/comps/CheckBox.svelte';

  import { data, ui } from '../states.svelte';
  import * as helpers from '../helpers';
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
    <div
      class='item w-full flex flex-row items-center'
      class:active={item.checked}
      class:drop-target={overIndex === i}
      draggable={true}
      {...dndHandlers(i)}
    >
      <CheckBox bind:checked={item.checked} />

      <button
        data-role='item-texts'
        class='grow flex flex-row items-center'
        onclick={() => {
          viewlogic.openDoc(item.data.uri);
        }}
      >
        <span data-role='title'>{item.data.title}</span>
        <span data-role='hash'>{helpers.extractHash(item.data.uri)}</span>

        {#if item.data.uri === helpers.toPersistentUri(ui.iframe.src)}
          <Check class='ml-auto'/>
        {/if}
      </button>

    </div>
  {/each}
</div>

<style>
  .drop-target {
    box-shadow: inset 0 2px 0 var(--vscode-focusBorder);
  }

  .item {
    padding: 0px 5px;
  }

  [data-role='item-texts'] {
    gap: 8px;
    padding: 5px;
    min-width: 0;
    cursor: pointer;
  }

  [data-role='title'] {
    color: var(--qt-text-default);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  [data-role='hash'] {
    min-width: 0;
    flex-shrink: 0;
    font-size: var(--qt-font-xs);
    color: var(--qt-text-muted);
  }
</style>
