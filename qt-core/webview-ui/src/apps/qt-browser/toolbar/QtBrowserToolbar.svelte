<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ChevronRight from "@/symbols/ChevronRight.svelte";
  import {
    Bookmark,
    BookmarkCheck,
    TextSearch,
    FolderArchive,
    FolderClock
  } from "@lucide/svelte";

  import './QtBrowserToolbar.css';
  import { ui } from '../states.svelte';
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';

  let el = $state(undefined as HTMLInputElement | undefined);
  let draft = $state<string | null>(null);
  const value = $derived(helpers.toFileUri(draft ?? ui.iframe.src));
  const popover = $derived(ui.popovers.find);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      viewlogic.openUri(value);
      reset();
    } else if (e.key === 'Escape') {
      reset();
    }
  }

  function toggleFindPopover(e: MouseEvent) {
    popover.visible = !popover.visible;
    e.stopPropagation();
  }

  function reset() {
    draft = null;
    requestAnimationFrame(() => { selectAll(); });
  }

  function selectAll() {
    el?.select();
  }
</script>

<div data-area='toolbar' class='flex flex-row gap-1'>
  {@render navButton('back')}
  {@render navButton('forward')}
  {@render bookmarkToggleButton()}
  {@render bookmarkViewToggleButton()}
  {@render historyViewToggleButton()}

  <input
    bind:this={el}
    {value}
    class='qt-input grow px-2'
    oninput={(e) => { draft = e.currentTarget.value; }}
    onblur={() => { draft = null;  }}
    onfocus={() => { selectAll(); }}
    onkeydown={onKeyDown}
  />

  <button
    bind:this={popover.refEl}
    data-role='nav-button'
    class='qt-button flex items-center justify-center'
    aria-pressed={popover.visible}
    onclick={toggleFindPopover}
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

{#snippet bookmarkToggleButton()}
  <button
    data-role='nav-button'
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.bookmark.edit({
        action: 'toggle',
        entry: {
          uri: helpers.toFileUri(ui.iframe.src),
          title: ui.iframe.title
        }
      })
    }}
  >
    {#if viewlogic.bookmark.has(helpers.toFileUri(ui.iframe.src))}
      <BookmarkCheck />
    {:else}
      <Bookmark />
    {/if}
  </button>
{/snippet}

{#snippet bookmarkViewToggleButton()}
  <button
    data-role='nav-button'
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.setLayerVisible('bookmark', !ui.layers.bookmark);
    }}
  >
    <FolderArchive />
  </button>
{/snippet}

{#snippet historyViewToggleButton()}
  <button
    data-role='nav-button'
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.setLayerVisible('history', !ui.layers.history);
    }}
  >
    <FolderClock />
  </button>
{/snippet}
