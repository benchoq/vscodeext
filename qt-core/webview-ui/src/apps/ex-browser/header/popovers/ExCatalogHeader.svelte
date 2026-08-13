<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../../states.svelte';
  import ExCloseButton from '../../others/ExCloseButton.svelte';

  function close() {
    ui.popovers.catalog.visible = false;
  }
</script>

<div data-root class='flex flex-row'>
  <div data-role='title'>Catalog</div>
  <ExCloseButton onClicked={close} />
</div>

<style>
  [data-root] {
    padding: 10px 14px;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  [data-role='title'] {
    font-size: 13px;
    font-weight: 600;
    color: var(--qt-text-default);
  }
</style>
