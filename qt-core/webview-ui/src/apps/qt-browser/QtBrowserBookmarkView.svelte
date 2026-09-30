<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';

  import { data, ui } from './states.svelte';
  import * as helpers from './helpers';
  import * as viewlogic from './viewlogic.svelte';
</script>

<div class='w-full h-full qt-item-list flex flex-col relative'>
  <div class='bg-gray-800 absolute inset-0 opacity-90'>
  </div>

  <div class='flex flex-col absolute inset-0 p-2'>
    {#each data.bookmarks as entry, i (i)}
      {#if i !== 0}
        <Separator />
      {/if}

      <button
        class='item flex flex-col gap-0'
        onclick={() => {
          viewlogic.openUri(entry.uri);
          ui.layers.bookmark = false;
        }}
      >
        <span>{entry.title}</span>
        <span>{helpers.toFileUri(entry.uri)}</span>
      </button>
    {/each}
  </div>
</div>
