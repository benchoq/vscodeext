<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ChevronRight from "@/symbols/ChevronRight.svelte";
  import { Bookmark } from "@lucide/svelte";

  import * as viewlogic from '../viewlogic.svelte';
  import { ui } from "../states.svelte";

  const loc = $derived.by(() => {
    const e = ui.history.currentEntry;
    return e
      ? `${e.filePathRel}${e.anchor ? '#' + e.anchor : ''}`
      : '<none>';
  });

  let keyword = $state('');
</script>

<div data-role='root' class='flex flex-row gap-1'>
  {@render navButton('back')}
  {@render navButton('forward')}
  <input
    value={loc}
    class='grow border-1'
    readonly={true}
  />
  <input
    bind:value={keyword}
    class='min-w-[200px] border-1'
  />
  <button
    class='w-[32px] border-1'
    onclick={() => {
      viewlogic.findInPage(keyword, 'new');
    }}
  >
    Find
  </button>
  <button
    class='w-[32px] border-1'
    onclick={() => {
      viewlogic.findInPage(keyword, 'prev');
    }}
  >
    &lt;
  </button>
  <button
    class='w-[32px] border-1'
    onclick={() => {
      viewlogic.findInPage(keyword, 'next');
    }}
  >
    &gt;
  </button>
  <button
    class='w-[32px] border-1'
    onclick={() => {
      keyword = '';
      viewlogic.findInPage(keyword, 'clear');
    }}
  >
    &times;
  </button>
  {@render bookmarkButton()}
</div>

{#snippet navButton(dir: 'back' | 'forward')}
  <button
    data-role='nav-button'
    class='flex items-center justify-center'
    class:rotate-180={dir==='back'}
    disabled={!ui.history.canGo(dir)}
    onclick={() => {
      viewlogic.navigate(dir);
    }}
  >
    <ChevronRight />
  </button>
{/snippet}

{#snippet bookmarkButton()}
  <button
    data-role='nav-button'
    class='flex items-center justify-center'
  >
    <Bookmark />
  </button>
{/snippet}

<style>
  [data-role='root'] {
    min-height: 36px;
    padding: 2px;
  }

  [data-role='nav-button'] {
    width: 32px;
    height: 32px;
    background-color: lightgray;

    &:disabled {
      background-color: transparent;
    }
  }
</style>
