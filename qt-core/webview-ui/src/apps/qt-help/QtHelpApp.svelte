<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import '@/styles/components/components.css';
  import './QtHelpApp.css';

  import DocViewerApp from '@/apps/doc-viewer/DocViewerApp.svelte';
  import QtHelpSidebar from './sidebar/QtHelpSidebar.svelte';
  import QtHelpSidebarHandle from './sidebar/QtHelpSidebarHandle.svelte';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  onMount(() => viewlogic.onAppMount());
  onDestroy(() => viewlogic.onAppDestroy());
</script>

<div class="w-screen h-screen flex flex-row">
  <div data-body class='flex flex-row grow'>
    <div style:width={`${ui.sidebar.width}px`} class="shrink-0">
      <QtHelpSidebar />
    </div>

    <QtHelpSidebarHandle />
    <DocViewerApp standalone={false} />
  </div>
</div>
