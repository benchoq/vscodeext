<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import CheckBox from '@/comps/CheckBox.svelte';
  import Separator from '@/comps/Separator.svelte';
  import * as format from '@/utils/format';

  import { data } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
  import type { HistoryViewEntry } from '../types.svelte';

  const groups = $derived.by(() => {
    const map = new Map<string, { label: string; items: HistoryViewEntry[] }>();

    for (const item of data.histories.toReversed()) {
      const date = new Date(item.data.timestamp ?? 0);
      const key = date.toDateString();
      let group = map.get(key);
      if (!group) {
        group = {
          items: [],
          label: date.toLocaleDateString(undefined, { dateStyle: 'full' }),
        };

        map.set(key, group);
      }

      group.items.push(item);
    }

    return [...map.values()];
  });

</script>

<div class='qt-item-list flex flex-col'>
  {#each groups as group (group.label)}
    <div data-role='date-header'>{group.label}</div>

    {#each group.items as item, i (item)}
      {#if i !== 0}
        <div class='pl-4'>
          <Separator />
        </div>
      {/if}

      <div class='w-full flex flex-row items-center'>
        <CheckBox bind:checked={item.checked} />

        <button
          class='item grow flex min-w-0 flex-row items-center gap-4'
          class:active={item.checked}
          title={helpers.toFileUri(item.data.uri)}
          onclick={() => {
            viewlogic.openUri(item.data.uri);
            viewlogic.setLayerVisible('history', false);
          }}
        >
          <span data-role='time'>
            {format.timeAsLocaleString(new Date(item.data.timestamp ?? 0))}
          </span>
          <span data-role='title'>{item.data.title}</span>
          <span data-role='hash'>
            {helpers.extractHash(item.data.uri)}
          </span>
          <span class='grow'></span>
        </button>
      </div>
    {/each}
  {/each}
</div>

<style>
  [data-role='date-header'] {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-s);
    padding: 1.0rem 0 0.5rem 0;
  }

  [data-role='time'] {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-xs);
    white-space: nowrap;
  }

  [data-role='title'] {
    color: var(--qt-text-default);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  [data-role='hash'] {
    min-width: 0;
    flex-shrink: 0;
    font-size: var(--qt-font-xs);
    color: var(--qt-text-muted);
  }
</style>
