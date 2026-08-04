<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';

  import ExSeparator from '../others/ExSeparator.svelte';
  import ExToolButton from '../others/ExToolButton.svelte';
  import ExDetailsSectionDetails from './ExDetailsSectionDetails.svelte';
  // import ExDetailsSectionActions from './ExDetailsSectionActions.svelte';

  import ExActionDocs from './ExActionDocs.svelte';
  import ExDetailsActionOpen from './ExActionOpen.svelte';
  import ExDetailsActionNewProject from './ExActionNewProject.svelte';
  import ExActionFileLists from './ExActionFileLists.svelte';

  import ExDetailsThumbnailAndDesc from './ExDetailsThumbnailAndDesc.svelte';
  import ExDetailsSectionTitle from './ExDetailsSectionTitle.svelte';

  // const example = $derived(ui.selected.example);
</script>

<div data-comp-root class='flex flex-col'>
  <div data-title-bar class='flex flex-row'>
    <span data-text>Example Details</span>
    <ExToolButton onClicked={() => {
      ui.sideBar.visible = false;
    }}>
      &times;
    </ExToolButton>
  </div>

  <ExDetailsThumbnailAndDesc />
  <ExSeparator margin='10px 0px'/>

  <div data-section class='flex flex-col'>
    <ExDetailsSectionTitle title='Actions' />
    <ExDetailsActionOpen />
    <ExDetailsActionNewProject />
    <ExActionDocs />
    <ExActionFileLists />
    <ExSeparator margin='10px 0px'/>
  </div>

  <ExDetailsSectionTitle title='Details' />
  <ExDetailsSectionDetails />
</div>

<style>
  [data-comp-root] {
    overflow: hidden auto;
    padding: 12px 14px 24px;
  }

  [data-title-bar] {
    margin-bottom: 6px;

    & > [data-text] {
      flex: 1;
      font-size: 10px;
      font-weight: 600;
      color: var(--qt-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
  }

  [data-section] {
    gap: 6px;
  }
/*
  [data-info] {
    [data-thumbnail] {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: var(--qt-radius-m);
      overflow: hidden;
      background: var(--qt-bg-default);
      margin-bottom: 12px;
      position: relative;
      align-items: stretch;
    }

    & > [data-name] {
      font-size: 14px;
      font-weight: 600;
      color: var(--qt-text-default);
      margin: 0 0 12px;
      line-height: 1.35;
    }

    & > [data-desc] {
      font-size: 12px;
      color: var(--qt-text-default);
      line-height: 1.6;
      margin: 0 0 12px;
    }
  }

  [data-section-header] {
    font-size: 10px;
    font-weight: 600;
    color: var(--qt-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin: 10px 0 10px;
  } */
</style>
