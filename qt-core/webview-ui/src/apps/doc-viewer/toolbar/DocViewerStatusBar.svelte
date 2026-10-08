<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ui } from '../states.svelte';
  import * as helpers from '../helpers'

  const uri = $derived(
    helpers.toDisplayUri(ui.iframe.hoveredUri || ui.iframe.src)
  );
</script>

<div data-role='url' class='w-full'>
  <span>{uri}</span>
</div>

<style>
  [data-role='url'] {
    padding: 2px 5px;
    opacity: 0.9;
    text-align: right;
    color: var(--qt-text-muted);
    background-color: var(--qt-bg-subtle);
  }
</style>
