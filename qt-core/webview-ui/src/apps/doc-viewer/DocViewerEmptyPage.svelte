<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { BookOpenText } from "@lucide/svelte";

</script>

<div class='w-full h-full flex items-center justify-center'>
  <div class='flex flex-col gap-5 items-center select-none'>
    <BookOpenText class='large' />
    <span data-role='name'>
      Qt documentation viewer
    </span>
  </div>
</div>

<style>
  [data-role='name'] {
    color: var(--qt-text-muted);
  }
</style>
