<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    size = 16
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 16 16"
  fill="currentColor"
  style="pointer-events:none"
>
  <rect x="1" y="1" width="6" height="6" rx="1"></rect>
  <rect x="9" y="1" width="6" height="6" rx="1"></rect>
  <rect x="1" y="9" width="6" height="6" rx="1"></rect>
  <rect x="9" y="9" width="6" height="6" rx="1"></rect>
</svg>
