<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    margin = '0px'
  } = $props();
</script>

<div
  data-root
  style:margin={margin}
>
</div>

<style>
  [data-root] {
    height: 1px;
    background: var(--qt-stroke-subtle);
    flex-shrink: 0;
  }
</style>
