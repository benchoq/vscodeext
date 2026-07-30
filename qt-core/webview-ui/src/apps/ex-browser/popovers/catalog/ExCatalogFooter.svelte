<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import Tooltip from 'flowbite-svelte/Tooltip.svelte';
  import * as chars from '@/utils/chars';
  import { exBrowser as texts } from '@/apps/texts';

  import { ui } from '../../states.svelte';
  import * as viewlogic from '../../viewlogic.svelte';

  const poolDirPath = $derived(ui.selected.package?.poolDir.fsPath);
</script>

<div data-comp-root class='flex-1 flex flex-row'>
  <span data-info>{chars.info}</span>

  <!-- TODO: style Tooltip -->
  <Tooltip class='text-left' placement='bottom' data-placement='bottom'>
    {texts.catalog.locationInfo}
  </Tooltip>

  <span data-location class='flex-1'>
    {poolDirPath ?? '-'}
  </span>
  <button
    data-ext-link
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
  [data-comp-root] {
    align-items: center;
    gap: 8px;
    color: var(--qt-text-muted);
    flex-shrink: 0;
    padding: 8px 14px;
    background: var(--qt-bg-default);

    & > [data-location] {
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > [data-info] {
      font-size: 13px;
    }

    & > [data-ext-link] {
      font-size: 14px;
      cursor: pointer;
      padding: 2px 4px;
      transition: color var(--duration-short);

      &:hover {
        color: var(--qt-text-default);
      }
    }
  }
</style>
