<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/base.v2.css';
  import '@/styles/tokens.v2.css';
  import '@/styles/components.v2.css';
  import './app.css';

  import ExHeader from './header/ExHeader.svelte';
  import ExMainView from './main/ExMainView.svelte';
  import ExSidePanel from './side-panel/ExSidePanel.svelte';
  import ExAllPopovers from './popovers/ExAllPopovers.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import { ui } from './states.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div
  data-app-root
  class='w-screen h-screen flex flex-col'
>
  <ExHeader />

  <div class='flex flex-row flex-1 min-h-0'>
    <div class='flex-1 overflow-x-hidden overflow-y-auto'>
      <ExMainView />
    </div>

    <div
      data-section-sidebar
      class:open={ui.sideBar.visible}
    >
      <ExSidePanel />
    </div>
  </div>

  <div class='z-100'>
    <ExAllPopovers />
  </div>
</div>

<style>
  [data-app-root] {
    overflow: hidden;
  }

  [data-section-sidebar] {
    width: 0;
    border-left: 1px solid transparent;
    background: var(--qt-bg-subtle);
    overflow: hidden;
    transition:
      width var(--qt-duration-base) var(--qt-easing-base),
      border-color var(--qt-duration-base);

    &.open {
      width: var(--side-panel-width);
      border-left-color: var(--qt-stroke-subtle);
    }
  }
</style>
