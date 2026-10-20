<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type HistoryEntry } from '@shared/doc-viewer';
  import CheckBox from '@/comps/CheckBox.svelte';
  import Separator from '@/comps/Separator.svelte';
  import * as format from '@/utils/format';

  import { data } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';

</script>

<div class='w-full flex flex-col'>
  {#each data.history.groups as g (g.label)}
    <div data-role='history-date'>
      {g.label}
    </div>

    <div class='qt-item-list !overflow-visible'>
      {#each g.items as item, i (item)}
        {#if i !== 0}
          <Separator class='pl-4' />
        {/if}

        <div
          class='item w-full flex flex-row'
          class:active={item.checked}
        >
          <CheckBox bind:checked={item.checked} />
          {@render itemContent(item.data)}
        </div>
      {/each}
      </div>
  {/each}
</div>

<!-- snippets -->
{#snippet itemContent(entry: HistoryEntry)}
  <button
    data-role='item-content'
    class='grow flex flex-row items-center'
    title={helpers.toDisplayUri(entry.uri)}
    onclick={() => {
      viewlogic.openDoc(entry.uri);
    }}
  >
    <span data-role='history-time'>
      {format.timeAsLocaleString(new Date(entry.timestamp ?? 0))}
    </span>
    <span data-role='item-title'>{entry.title}</span>
    <span data-role='item-hash'>{helpers.extractHash(entry.uri)}</span>
  </button>
{/snippet}
