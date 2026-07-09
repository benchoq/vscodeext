<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/app.css';
  import './styles.css';

  import ExHeader from './ExHeader.svelte';
  import ExMainView from './ExMainView.svelte';
  import ExSidePanel from './ExSidePanel.svelte';
  import ExOverlaysContainer from './ExOverlaysContainer.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='w-screen h-screen flex flex-col overflow-hidden'>
  <ExHeader />

  <div class='flex flex-row flex-1 min-h-0'>
    <div class='flex-1 overflow-x-hidden overflow-y-auto'>
      <ExMainView />
    </div>

    <div
      class='panel overflow-hidden'
      class:open={ui.overlays.details.visible}
    >
      <ExSidePanel />
    </div>
  </div>

  <ExOverlaysContainer />
</div>

<style>
  .panel {
    width: 0;
    border-left: 1px solid transparent;
    background: var(--qt-bg-subtle);
    transition:
      width var(--qt-duration-base) var(--qt-easing-base),
      border-color var(--qt-duration-base);
  }

  .panel.open {
    width: var(--app-panel-width);
    border-left-color: var(--qt-stroke-subtle);
  }
</style>
