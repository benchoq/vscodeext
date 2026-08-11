<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components.v2.css';
  import './app.css';

  import ExHeader from './header/ExHeader.svelte';
  import ExMainView from './main/ExMainView.svelte';
  import ExSidePanel from './side-panel/ExSidePanel.svelte';
  import ExAllPopovers from './ExAllPopovers.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class='w-screen h-screen flex flex-col' >
  <ExHeader />

  <div data-body class='flex flex-row'>
    <ExMainView />

    <div data-sidebar class:open={ui.sideBar.visible}>
      <ExSidePanel />
    </div>
  </div>

  <div class='z-100'>
    <ExAllPopovers />
  </div>
</div>

<style>
  [data-body] {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  [data-sidebar] {
    width: 0;
    border-left: 1px solid transparent;
    background: var(--qt-bg-subtle);
    overflow: hidden;
    transition-property: width, border-color;
    transition-duration: var(--duration-short);
    transition-timing-function: cubic-bezier(.4,0,.2,1), ease;

    &.open {
      width: var(--side-panel-width);
      border-left-color: var(--qt-stroke-subtle);
    }
  }
</style>
