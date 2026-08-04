<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    title = ''
  } = $props();
</script>

<div data-header>
  {title}
</div>

<style>
  [data-header] {
    font-size: 12px;
    font-weight: 400;
    color: var(--qt-text-muted);
    text-transform: uppercase;
  }
</style>
