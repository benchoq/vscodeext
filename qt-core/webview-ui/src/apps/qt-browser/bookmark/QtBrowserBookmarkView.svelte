<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Separator from '@/comps/Separator.svelte';
  import QtBrowserBookmarkToolbar from './QtBrowserBookmarkToolbar.svelte';

  import { data, ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='w-full h-full qt-item-list flex flex-col relative'>
  <div class='bg-gray-800 absolute inset-0 opacity-90'>
  </div>

  <div class='flex flex-col absolute inset-0 p-2'>
    <QtBrowserBookmarkToolbar />

    {#each data.bookmarks as item, i (i)}
      {#if i !== 0}
        <Separator />
      {/if}

      <div class='flex flex-row items-center'>
        <input
          type="checkbox"
          aria-label="check"
          bind:checked={item.checked}
        />

        <button
          class='item flex flex-col gap-0'
          onclick={() => {
            viewlogic.openUri(item.data.uri);
            ui.layers.bookmark = false;
          }}
        >
          <span>{item.data.title}</span>
          <span>{helpers.toFileUri(item.data.uri)}</span>
        </button>
      </div>
    {/each}
  </div>
</div>
