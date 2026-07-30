<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';

  import Row from '@/comps/Row.svelte';
  import Column from '@/comps/Column.svelte';
  import ExThumbnail from '../others/ExThumbnail.svelte';
  import ExDetailsSectionMeta from './ExDetailsSectionMeta.svelte';
  import ExDetailsSectionActions from './ExDetailsSectionActions.svelte';
  const example = $derived(ui.selected.example);
</script>

<Column class='wrapper'>
  {@render Title()}
  {@render Info()}
  {@render Separator()}
  {@render Actions()}
  {@render Separator()}
  {@render Details()}
</Column>

{#snippet Title()}
  <Row>
    <span class='title flex-1'>Example Details</span>
    <button
      class='title-close'
      onclick={() => {
        ui.sideBar.visible = false;
      }}
    >
      x
    </button>
  </Row>
{/snippet}

{#snippet Info()}
  <div class='thumbnail'><ExThumbnail {example} /></div>
  <div class='name'>{example?.name ?? ''}</div>
  <div class='description'>{example?.description}</div>
{/snippet}

{#snippet Actions()}
  <span class='section-header'>Actions</span>
  <ExDetailsSectionActions />
{/snippet}

{#snippet Details()}
  <span class='section-header'>Details</span>
  <ExDetailsSectionMeta />
{/snippet}

{#snippet Separator()}
  <div class='separator'></div>
{/snippet}

<style>
  :global(.wrapper) {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 14px 24px;
  }

  :global(.title) {
    font-size: 10px;
    font-weight: 600;
    color: var(--qt-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  :global(.title-close) {
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    color: var(--qt-text-muted);
    cursor: pointer;
    border-radius: var(--qt-radius-s);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    padding: 0;
    transition: background var(--duration-short);
  }

  :global(.title-close:hover) {
    background: var(--qt-icon-hover-bg);
    color: var(--qt-text-default);
  }

  :global(.namee) {
    font-size: 14px;
    font-weight: 600;
    color: var(--qt-text-default);
    margin: 0 0 12px;
    line-height: 1.35;
  }

  :global(.description) {
    font-size: 12px;
    color: var(--qt-text-default);
    line-height: 1.6;
    margin: 0 0 12px;
  }

  :global(.section-header) {
    font-size: 10px;
    font-weight: 600;
    color: var(--qt-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin: 0 0 6px;
  }

  :global(.separator) {
    height: 1px;
    background: var(--qt-stroke-subtle);
    margin: 10px 0;
  }

  :global(.thumbnail) {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--qt-radius-m);
    overflow: hidden;
    background: var(--qt-bg-default);
    margin-bottom: 12px;
    position: relative;
    display: flex;
    align-items: stretch;
  }

  :global(.detail-row-title) {
    font-size: 11px;
    font-weight: 500;
    color: var(--qt-text-muted);
    min-width: 60px;
    flex-shrink: 0;
    line-height: 18px;
  }

  :global(.empty-value) {
    font-size: 11px;
    color: var(--qt-text-muted);
    font-style: italic;
  }

</style>
