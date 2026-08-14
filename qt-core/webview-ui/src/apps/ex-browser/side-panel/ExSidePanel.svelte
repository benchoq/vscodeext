<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import type { Snippet } from 'svelte';
  import './ExSidePanel.css';

  import { ui } from '../states.svelte';
  import ExSeparator from '../others/ExSeparator.svelte';
  import ExCloseButton from '../others/ExCloseButton.svelte';

  import ExActionDocs from './ExActionDocs.svelte';
  import ExActionNewProject from './ExActionNewProject.svelte';
  import ExActionOpenExample from './ExActionOpenExample.svelte';
  import ExThumbnailAndDesc from './ExThumbnailAndDesc.svelte';
  import ExDetailsTable from './ExDetailsTable.svelte';

  function close() {
    ui.sideBar.visible = false;
  }

  const sectionContent: Snippet[] = [infoContent, actionContent, detailContent];
</script>

<div data-root class="flex flex-col gap-[12px]">
  {#each sectionContent as section, index (index)}
    {#if index !== 0}
      <ExSeparator />
    {/if}

    <div class="flex flex-col gap-[6px]">
      {@render section()}
    </div>
  {/each}
</div>

<!-- snippets -->
{#snippet infoContent()}
  <div class="flex flex-row items-center">
    <div data-role="title">Example Details</div>
    <ExCloseButton onClicked={close} />
  </div>
  <ExThumbnailAndDesc />
{/snippet}

{#snippet actionContent()}
  <div data-role="title">Actions</div>
  <ExActionOpenExample />
  <ExActionNewProject />
  <ExActionDocs />
{/snippet}

{#snippet detailContent()}
  <div data-role="title">Details</div>
  <ExDetailsTable />
{/snippet}

<style>
  [data-root] {
    overflow: hidden auto;
    padding: 12px 14px 24px;
  }

  [data-role='title'] {
    flex: 1;
    color: var(--qt-text-muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
</style>
