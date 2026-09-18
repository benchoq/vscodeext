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

<div data-role='root' class='flex flex-row h-[32px] gap-1'>
  {@render navButton('back')}
  {@render navButton('forward')}
  <input
    value={loc}
    class='qt-input grow px-2'
    readonly={true}
  />
  <input
    bind:value={keyword}
    class='qt-input min-w-[200px] px-2'
  />
  <button
    class='qt-button'
    onclick={() => {
      viewlogic.findInPage(keyword, 'new');
    }}
  >
    Find
  </button>
  <button
    class='qt-button'
    onclick={() => {
      viewlogic.findInPage(keyword, 'prev');
    }}
  >
    &lt;
  </button>
  <button
    class='qt-button'
    onclick={() => {
      viewlogic.findInPage(keyword, 'next');
    }}
  >
    &gt;
  </button>
  <button
    class='qt-button'
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
    class='qt-button flex items-center justify-center'
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
    class='qt-button flex items-center justify-center'
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

    &:disabled {
      background-color: transparent;
    }
  }
</style>
