<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/app.css';
  import ExHeader from './ExHeader.svelte';
  import ExBody from './ExBody.svelte';
  import ExDetailsPanel from './ExDetailsPanel.svelte';
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
      <ExBody />
    </div>

    <div class={`panel ${ui.overlays.details.visible ? 'open' : ''}`}>
      <ExDetailsPanel />
    </div>
  </div>

  <ExOverlaysContainer />
</div>

<style>
  :global(.panel) {
    width: 0;
    overflow: hidden;
    border-left: 1px solid transparent;
    background: var(--qt-bg-subtle);
    transition: width 220ms cubic-bezier(.4,0,.2,1), border-color 220ms;
  }

  :global(.panel.open) {
    width: 320px;
    border-left-color: var(--qt-stroke-subtle);
  }
</style>
