<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';

  import ExSeparator from '../others/ExSeparator.svelte';
  import ExCloseButton from '../others/ExCloseButton.svelte';

  import ExThumbnailAndDesc from './ExThumbnailAndDesc.svelte';
  import ExActionDocs from './ExActionDocs.svelte';
  import ExActionOpen from './ExActionOpen.svelte';
  import ExActionNewProject from './ExActionNewProject.svelte';
  import ExDetailsTable from './ExDetailsTable.svelte';
</script>

<div data-comp-root data-area='side-panel' class='flex flex-col'>
  <div data-title-bar class='flex flex-row'>
    <span data-role='title' class='flex-1'>
      Example Details
    </span>

    <ExCloseButton onClicked={() => {
      ui.sideBar.visible = false;
    }} />
  </div>

  <ExThumbnailAndDesc />
  <ExSeparator margin='10px 0px'/>

  <div data-section class='flex flex-col'>
    <div data-role='section-header'>Actions</div>
    <ExActionOpen />
    <ExActionNewProject />
    <ExActionDocs />
  </div>

  <ExSeparator margin='10px 0px'/>

  <div data-section class='flex flex-col'>
    <div data-role='section-header'>Details</div>
    <ExDetailsTable />
  </div>
</div>

<style>
  [data-role='title'] {
    color: var(--qt-text-muted);
  }

  [data-role='section-header'] {
    margin: 5px 0px;
    color: var(--qt-text-muted);
  }

  [data-comp-root] {
    overflow: hidden auto;
    padding: 12px 14px 24px;
  }

  [data-title-bar] {
    margin-bottom: 6px;
  }

  [data-section] {
    gap: 6px;
  }
</style>
