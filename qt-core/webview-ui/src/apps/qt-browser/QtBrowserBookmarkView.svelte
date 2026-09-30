<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
</script>

<div class='w-full h-full qt-item-list flex flex-col relative'>
  <div class='bg-gray-500 absolute inset-0 opacity-90'>
  </div>

  <div class='flex flex-col absolute inset-0 p-2'>
    {#each data.bookmarks as uri, i (i)}
      <button
        class='item flex flex-row items-center gap-2'
        onclick={() => {
          viewlogic.openUri(uri);
          ui.layers.bookmark = false;
        }}
      >
        {uri}
      </button>
    {/each}
  </div>
</div>
