<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ChevronRight from "@/symbols/ChevronRight.svelte";
  import { Bookmark, TextSearch } from "@lucide/svelte";

  import * as viewlogic from '../viewlogic.svelte';
  import { ui } from "../states.svelte";

  const loc = $derived.by(() => {
    const e = ui.history.currentEntry;
    return e
      ? `${e.filePathRel}${e.anchor ? '#' + e.anchor : ''}`
      : '<none>';
  });

</script>

<div data-role='root' class='flex flex-row h-[32px] gap-1'>
  {@render navButton('back')}
  {@render navButton('forward')}
  {@render bookmarkButton()}
  <input
    value={loc}
    class='qt-input grow px-2'
    readonly={true}
  />

  <button
    bind:this={ui.popover.refEl}
    data-role='nav-button'
    class='qt-button flex items-center justify-center'
    aria-pressed={ui.popover.visible}
    onclick={(e: MouseEvent) => {
      ui.popover.visible = !ui.popover.visible;
      e.stopPropagation();
    }}
  >
    <TextSearch />
  </button>

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
