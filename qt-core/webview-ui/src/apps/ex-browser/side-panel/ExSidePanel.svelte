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
  import ExActionNewProject from './ExActionNewProject.svelte';
  import ExActionOpenExample from './ExActionOpenExample.svelte';
  import ExDetailsTable from './ExDetailsTable.svelte';

  function close() {
    ui.sideBar.visible = false;
  }
</script>

<div data-root class='flex flex-col gap-[6px]'>
  <div class='flex flex-col'>
    <div class='flex flex-row'>
      <span data-role='title' class='flex-1'>Example Details</span>
      <ExCloseButton onClicked={close} />
    </div>
    <ExThumbnailAndDesc />
  </div>

  <ExSeparator margin='10px 0px'/>

  <div class='flex flex-col'>
    <div data-role='section-header'>Actions</div>
    <ExActionOpenExample />
    <ExActionNewProject />
    <ExActionDocs />
  </div>

  <ExSeparator margin='10px 0px'/>

  <div class='flex flex-col'>
    <div data-role='section-header'>Details</div>
    <ExDetailsTable />
  </div>
</div>

<style>
  [data-root] {
    overflow: hidden auto;
    padding: 12px 14px 24px;
  }

  [data-role='title'] {
    color: var(--qt-text-muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  [data-role='section-header'] {
    margin: 5px 0px;
    color: var(--qt-text-muted);
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
  }
</style>
