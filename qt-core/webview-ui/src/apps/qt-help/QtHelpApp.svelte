<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import Popover from '@/comps/Popover.svelte';
  import DocViewerApp from '@/apps/doc-viewer/DocViewerApp.svelte';

  import QtHelpSidebar from './sidebar/QtHelpSidebar.svelte';
  import QtHelpDocViewerMask from './QtHelpDocViewerMask.svelte';
  import QtHelpQtVersionPopover from './QtHelpQtVersionPopover.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-row">
  <div style:width={`${ui.sidebar.width}px`} class="shrink-0">
    <QtHelpSidebar />
  </div>

  {#if ui.popovers.qtVersions.visible}
    <Popover
      reference={ui.popovers.qtVersions.refEl}
      placement='bottom'
      offset={5}
      onClose={() => {
        ui.popovers.qtVersions.visible = false;
      }}
    >
      <QtHelpQtVersionPopover />
    </Popover>
  {/if}

  <div class='w-full h-full overflow-x-hidden relative'>
    <DocViewerApp fullScreen={false} />
    <QtHelpDocViewerMask />
  </div>
</div>
