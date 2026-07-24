<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Tooltip from 'flowbite-svelte/Tooltip.svelte';
  import * as chars from '@/utils/chars';
  import { exBrowser as texts } from '@/apps/texts';

  import { ui } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const poolDirPath = $derived(ui.selected.package?.poolDir.fsPath);
</script>

<div class='footer'>
  <p class='info'>{chars.info}</p>
  <Tooltip class='qt-tooltip text-left' placement='bottom' data-placement='bottom'>
    {texts.catalog.locationInfo}
  </Tooltip>

  <div class='location'>
    {poolDirPath ?? '-'}
  </div>

  <button
    class='external-link'
    title={texts.catalog.revealLocationTooltip}
    onclick={() => {
      if (poolDirPath) {
        viewlogic.openFolder(poolDirPath);
      }
    }}
  >
    {chars.openExternal}
  </button>
</div>

<style>
  .footer {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 8px;
  }

  .info {
    color: var(--qt-text-muted);
    font-size: 13px;
    flex-shrink: 0;
  }

  .location {
    flex: 1;
    font-size: 11px;
    color: var(--qt-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .external-link {
    background: none;
    border: none;
    color: var(--qt-text-muted);
    font-size: 14px;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: var(--qt-radius-s);
    flex-shrink: 0;
    transition: color 80ms;
  }
</style>
