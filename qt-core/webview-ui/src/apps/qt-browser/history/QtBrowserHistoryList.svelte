<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';

  import * as format from '@/utils/format';
  import CheckBox from '@/comps/CheckBox.svelte';
  import { data } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-col'>
  {#each data.histories.toReversed() as item, i (i)}
    {#if i !== 0}
      <Separator />
    {/if}

    <div class='qt-item-list w-full flex flex-row items-center'>
      <CheckBox bind:checked={item.checked} />

      <button
        class='item grow flex flex-row items-center gap-4'
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
        <span class='grow'></span>
      </button>
    </div>
  {/each}
</div>

<style>
  [data-role='title'] {
    color: var(--qt-text-default);
  }

  [data-role='time'] {
    color: var(--qt-text-muted);
    font-size: var(--qt-font-xs);
  }
</style>
