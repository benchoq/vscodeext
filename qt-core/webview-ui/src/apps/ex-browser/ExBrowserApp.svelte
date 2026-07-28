<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/base.v2.css';
  import '@/styles/tokens.v2.css';
  import '@/styles/components.v2.css';

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
    /* variables for overall layout */
    --popup-border: 1px solid var(--qt-stroke-subtle);
    --popup-shadow: 0 8px 24px rgba(0,0,0,0.45);

    --catalog-popup-width: 480px;
    --catalog-section-separator: 1px solid var(--qt-stroke-subtle);

    --tags-popup-width: 380px;
    --tags-popup-max-height: 300px;

    --card-min-width: 232px;
    --card-min-height: 220px;
    --card-thumbnail-min-height: 110px;

    --side-panel-width: 320px;

    /* others */
    --transition-fast: background 80ms, border-color 80ms, color 80ms;

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
