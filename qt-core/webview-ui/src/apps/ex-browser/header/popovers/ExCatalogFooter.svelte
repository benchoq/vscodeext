<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  // import Tooltip from 'flowbite-svelte/Tooltip.svelte';
  import * as chars from '@/utils/chars';

  import ExToolButton from '../../others/ExToolButton.svelte';
  import { ui } from '../../states.svelte';
  import * as viewlogic from '../../viewlogic.svelte';

  const poolDirPath = $derived(ui.selected.package?.poolDir.fsPath);
</script>

<div data-comp-root class='flex-1 flex flex-row'>
  <span data-role='footer-icon-info'>
    {chars.info}
  </span>

  <!-- TODO: style Tooltip -->
  <!-- <Tooltip class='text-left' placement='bottom' data-placement='bottom'>
    {texts.catalog.locationInfo}
  </Tooltip> -->

  <span data-role='footer-location' class='flex-1'>
    {poolDirPath ?? '-'}
  </span>

  <ExToolButton
    onClicked={() => {
      if (poolDirPath) {
        viewlogic.openFolder(poolDirPath);
      }
    }}
  >
    {chars.openExternal}
  </ExToolButton>
</div>

<style>
  [data-comp-root] {
    align-items: center;
    gap: 8px;
    color: var(--qt-text-muted);
    flex-shrink: 0;
    padding: 8px 14px;
    background: var(--qt-bg-default);
  }
</style>
