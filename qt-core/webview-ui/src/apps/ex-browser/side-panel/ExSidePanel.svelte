<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import './ExSidePanel.css';
  import { exBrowser } from '@/apps/texts';

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

  const texts = exBrowser.details;
  const sectionContent = [infoContent, actionContent, detailContent];
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
    <div data-role="title">{texts.title}</div>
    <ExCloseButton onClicked={close} />
  </div>
  <ExThumbnailAndDesc />
{/snippet}

{#snippet actionContent()}
  <div data-role="title">{texts.actions.title}</div>
  <ExActionOpenExample />
  <ExActionNewProject />
  <ExActionDocs />
{/snippet}

{#snippet detailContent()}
  <div data-role="title">{texts.details.title}</div>
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
    font-size: var(--qt-font-2xs);
    font-weight: var(--qt-font-semibold);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
</style>
