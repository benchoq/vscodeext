<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Component } from 'svelte';
  import { Book, ListTree, Search } from '@lucide/svelte';

  import * as viewlogic from '../viewlogic.svelte';
  import { type UiMode } from '../states.svelte';
</script>

<div class='flex flex-row h-[32px] gap-2'>
  <button
    class='qt-button flex flex-row'
  >
    Qt 6.11.1
  </button>

  <div class='grow'></div>

  <div class='flex flex-row gap-1'>
    {@render modeButton('toc', Book)}
    {@render modeButton('index', ListTree)}
    {@render modeButton('text', Search)}
  </div>
</div>

{#snippet modeButton(mode: UiMode, Icon: Component)}
  <button
    class='qt-button flex flex-row'
    onclick={() => {
      viewlogic.setMode(mode);
    }}
  >
    <Icon />
  </button>
{/snippet}