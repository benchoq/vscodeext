<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Button from 'flowbite-svelte/Button.svelte';
  import { Search, X } from '@lucide/svelte';

  import './app-styles.css';

  // import IconButton from '@/comps/IconButton.svelte';
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  let value = $derived(ui.filter.query);
  let timer: ReturnType<typeof setTimeout>;

  const SearchOrX = $derived(value.trim().length === 0 ? Search : X);
  const hasValidSelection = $derived.by(() => {
    return (ui.selected.package?.name ?? '')
      && (ui.filter.category?.name ?? '');
  });

  const countText = $derived.by(() => {
    const count = ui.filter.category?.count ?? 0;
    const countAll = data.categories.find(c => c.type === 'all')?.count ?? 0;
    if (countAll === 0) {
      return '';
    }

    return (count === countAll)
      ? `${count} examples`
      : `${count} / ${countAll}`
  });

  const tagsCountText = $derived.by(() => {
    return (ui.filter.category?.tags.length ?? 0).toString();
  });

  const placeholder = $derived.by(() => {
    if (!ui.filter.category
      || !ui.filter.category.name
      || ui.filter.category.type === 'all') {
      return texts.searchBox.defaultPlaceholder;
    }

    return texts.searchBox.placeholder(ui.filter.category.name);
  });

  function clear() {
    value = '';
    triggerUpdate(0);
  }

  function triggerUpdate(delay = 500) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      viewlogic.setQuery(value);
    }, delay);
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        triggerUpdate(0);
        viewlogic.setOverlayVisible('tagCloud', false);
        break;

      case ' ':
      case 'Escape':
      case 'Backspace':
        viewlogic.setOverlayVisible('tagCloud', false);
        break;

      case '#':
        viewlogic.setOverlayVisible('tagCloud', true);
        break;
    }
  }

  function onFocusIn() {
    viewlogic.setOverlayVisible('catalog', false);
  }

  $effect(() => {
    value = ui.filter.query;
  })
</script>

<div class="w-full flex flex-row gap-2 header">
  {@render CatalogButton()}
  {@render TagButton()}
  {@render KeywordInput()}
</div>

<!-- snippets -->
{#snippet CatalogButton()}
  <Button
    class='button-base tag-button flex flex-row items-center'
    aria-expanded={ui.overlays.catalog.visible}
    disabled={data.packages.length === 0}
    onclick={() => {
      viewlogic.setOverlayVisible('catalog', !ui.overlays.catalog.visible);
    }}
  >
    {#if data.packages.length === 0 || !hasValidSelection}
      -
    {:else}
      <div class='flex flex-row items-center gap-[6px]'>
        <p>Categories</p>
        {@render DecorationText('›')}
        <p>{ui.selected.package?.name ?? ''}</p>
        {@render DecorationText('›')}
        <p>{ui.filter.category?.name ?? ''}</p>
        <p class='count-badge'>{countText}</p>
        {@render DecorationText('▾')}
      </div>
    {/if}
  </Button>
{/snippet}

{#snippet TagButton()}
  <Button
    class='button-base tag-button flex flex-row items-center'
    aria-expanded={ui.overlays.tagCloud.visible}
    disabled={(ui.filter.category?.tags.length ?? 0) === 0}
    onclick={(e: MouseEvent) => {
      ui.overlays.tagCloud.refRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      viewlogic.setOverlayVisible('tagCloud', !ui.overlays.tagCloud.visible);
    }}
  >
    # Tags
    <p class='count-badge'>{tagsCountText}</p>
  </Button>
{/snippet}

{#snippet KeywordInput()}
  <div class={`
    relative w-full h-full flex-grow flex flex-row items-center gap-2
  `}>
    <button
      class='absolute left-4 top-1/2 -translate-y-1/2'
      disabled={data.packages.length === 0}
      onclick={clear}
    >
      <SearchOrX />
    </button>

    <input
      bind:value
      type="text"
      class='qt-input w-full h-full !pl-12'
      {placeholder}
      disabled={data.packages.length === 0}
      oninput={() => { triggerUpdate(500); }}
      onkeydown={onKeydown}
      onfocusin={onFocusIn}
    />
  </div>
{/snippet}

{#snippet DecorationText(t: string)}
  <p>{t}</p>
{/snippet}

<style>
  :global(.button-base) {
    height: 28px;
    padding: 0 10px;
    color: var(--qt-text-default);
    background: var(--qt-bg-input);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
    white-space: nowrap;

    transition: border-color 100ms;
  }

  :global(.button-base:hover) {
    border-color: var(--qt-stroke-muted);
  }

  :global(.button-base[aria-expanded="true"]) {
    border-color: var(--qt-accent-info);
  }

  :global(.catalog-button) {
    color: var(--qt-text-muted);
    gap: 6px;
  }

  :global(.tag-button) {
    color: var(--qt-text-muted);
    gap: 6px;
  }

  :global(.count-badge) {
    height: 14px;
    padding: 0 5px;
    color: var(--qt-text-muted);
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: 7px;
    white-space: nowrap;
    font-size: 9px;
    font-weight: 600;
  }
</style>
