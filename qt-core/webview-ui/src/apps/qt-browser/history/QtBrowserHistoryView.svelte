<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';
  import QtBrowserHistoryToolbar from './QtBrowserHistoryToolbar.svelte';

  import { data, ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';

</script>

<div class='w-full h-full qt-item-list flex flex-col relative'>
  <div class='bg-gray-800 absolute inset-0 opacity-90'>
  </div>

  <div class='flex flex-col absolute inset-0 p-2'>
    <QtBrowserHistoryToolbar />

    {#each data.histories as item, i (i)}
      {#if i !== 0}
        <Separator />
      {/if}

      <div
        role='listitem'
        class='w-full flex flex-row items-center'
        draggable={true}
      >
        <input
          type="checkbox"
          aria-label="check"
        />

        <button
          class='grow item flex flex-col gap-0'
          onclick={() => {
            viewlogic.openUri(item.uri);
            ui.layers.history = false;
          }}
        >
          <span>{item.title}</span>
          <span>{helpers.toFileUri(item.uri)}</span>
        </button>
      </div>
    {/each}
  </div>
</div>
