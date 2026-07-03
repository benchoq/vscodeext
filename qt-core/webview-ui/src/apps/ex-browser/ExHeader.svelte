<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import './app-styles.css';

  import { Grid, List } from '@/icons';
  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  let value = $derived(ui.filter.query);
  let timer: ReturnType<typeof setTimeout>;

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

  function triggerUpdate(delay = 200) {
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
  {@render SearchInput()}
  {@render ViewModeButtons()}
</div>

<!-- snippets -->
{#snippet CatalogButton()}
  <button
    class='breadcrumb-wrapper'
    aria-expanded={ui.overlays.catalog.visible}
    disabled={data.packages.length === 0}
    onclick={() => {
      viewlogic.setOverlayVisible('catalog', !ui.overlays.catalog.visible);
    }}
  >
    {#if data.packages.length === 0 || !hasValidSelection}
      <p class='breadcrumb-text'>-</p>
    {:else}
      <p class='breadcrumb-text bold'>Categories</p>
      <p class='breadcrumb-separator'>›</p>
      <p class='breadcrumb-text'>{ui.selected.package?.name ?? ''}</p>
      <p class='breadcrumb-separator'>›</p>
      <p class='breadcrumb-text active'>{ui.filter.category?.name ?? ''}</p>
      <p class='count-badge'>{countText}</p>
      <p class='breadcrumb-separator'>▾</p>
    {/if}
  </button>
{/snippet}

{#snippet TagButton()}
  <button
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
  </button>
{/snippet}

{#snippet SearchInput()}
  <div class='relative w-full h-full flex-grow flex flex-row items-center gap-2'>
    <div class='absolute left-4 top-1/2 -translate-y-1/2'>
      <p>⌕</p>
    </div>

    <input
      bind:value
      type="text"
      class='qt-input w-full h-full !pl-10'
      {placeholder}
      disabled={data.packages.length === 0}
      oninput={() => { triggerUpdate(500); }}
      onkeydown={onKeydown}
      onfocusin={onFocusIn}
    />

    <div
      class='absolute right-4 top-1/2 -translate-y-1/2'
      class:invisible={value.trim().length === 0}
      style:font-size='13px'
    >
      <button onclick={clear} class='cursor-pointer'>
        X
      </button>
    </div>
  </div>
{/snippet}

{#snippet ViewModeButtons()}
  <div class='flex flex-row tool-button-wrapper'>
    <button title="Card view" class='tool-button active'><Grid /></button>
    <button title="List view" class='tool-button'><List /></button>
  </div>
{/snippet}

<style>
  :global(.catalog-button) {
    color: var(--qt-text-muted);
    gap: 6px;
  }

  :global(.tag-button) {
    color: var(--qt-text-muted);
    gap: 6px;
  }

  /* button */
  :global(.button-base) {
    height: 28px;
    padding: 0 10px;

    color: var(--qt-text-default);
    background: var(--qt-bg-input);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);

    line-height: 1.4;
    white-space: nowrap;
    transition: border-color 100ms;
  }

  :global(.button-base:hover) {
    border-color: var(--qt-stroke-muted);
  }

  :global(.button-base[aria-expanded="true"]) {
    border-color: var(--qt-accent-info);
  }

  /* breadcrumb */
  :global(.breadcrumb-text) {
    color: var(--qt-text-muted);
    font-size: 12px;
  }

  :global(.breadcrumb-text.bold) {
    font-weight: 600;
  }

  :global(.breadcrumb-text.active) {
    color: var(--qt-text-default);
    font-weight: 500;
  }

  :global(.breadcrumb-separator) {
    color: var(--qt-text-muted);
    opacity: 0.5;
    font-size: 11px;
  }

  :global(.breadcrumb-wrapper) {
    height: 28px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 6px;

    color: var(--qt-text-default);
    background: var(--qt-bg-input);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);

    font-size: 13px;
    font-family: inherit;

    cursor: pointer;
    white-space: nowrap;
    transition: border-color 100ms;
  }

  /* badge */
  :global(.count-badge) {
    height: 14px;
    padding: 0 5px;

    color: var(--qt-text-muted);
    background: var(--qt-bg-elevated);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: 7px;

    font-size: 9px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* tool button */
  :global(.tool-button) {
    width: 26px;
    height: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--qt-text-muted);
    background: none;
    border: none;

    cursor: pointer;
    transition: background 100ms, color 100ms;
  }

  :global(.tool-button:hover) {
    color: var(--qt-text-default);
    background: var(--qt-hover-bg);
  }

  :global(.tool-button.active) {
    color: var(--qt-accent-active);
    background: rgba(0, 122, 204, 0.15);
  }

  :global(.tool-button + .tool-button) {
    border-left: 1px solid var(--qt-stroke-subtle);
  }

  :global(.tool-button-wrapper) {
    display: flex;
    flex-shrink: 0;
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-s);
  }

</style>
