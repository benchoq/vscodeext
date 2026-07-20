<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Tooltip from 'flowbite-svelte/Tooltip.svelte';
  import { ExternalLink, Info } from '@lucide/svelte';

  // import Overlay from '@/comps/Overlay.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import Row from '@/comps/Row.svelte';
  import { exBrowser as texts } from '@/apps/texts';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const poolDirPath = $derived(ui.selected.package?.poolDir.fsPath);
</script>

<Row class='items-center'>
  <Info />
  <Tooltip class='qt-tooltip text-left' placement='bottom' data-placement='bottom'>
    {texts.catalog.locationInfo}
  </Tooltip>

  <div class={`
    qt-label grow
    text-left whitespace-nowrap overflow-hidden overflow-ellipsis
  `}>
    {texts.catalog.location}: {poolDirPath ?? '-'}
  </div>

  <IconButton
    flat square
    class='!border-none !w-0'
    icon={ExternalLink}
    tooltip={texts.catalog.revealLocationTooltip}
    tooltipPlacement='top-end'
    onClicked={() => {
      if (poolDirPath) {
        viewlogic.openFolder(poolDirPath);
      }
    }}
  />
</Row>

<style>
  .panel {
    /* width: 480px; */
    background: var(--qt-bg-subtle);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-m);
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    overflow: hidden;
  }

</style>
