<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Book, ListTree } from '@lucide/svelte';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-row h-[32px] gap-2'>
  <button
    class='qt-button flex flex-row'
  >
    Qt 6.11.1
  </button>

  <div class='grow'></div>

  <div class='flex flex-row gap-1'>
    <button
      class='qt-button flex flex-row'
      onclick={() => {
        viewlogic.setMode('toc');
      }}
    >
      <Book />
    </button>

    <button
      class='qt-button flex flex-row'
      onclick={() => {
        viewlogic.setMode('index');
      }}
    >
      <ListTree />
    </button>
  </div>
</div>
