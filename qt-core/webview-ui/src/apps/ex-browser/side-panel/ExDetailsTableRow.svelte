<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type Snippet } from 'svelte';
  import ExSeparator from '../others/ExSeparator.svelte';

  let {
    title = '',
    separator = true,
    children = undefined as Snippet | undefined
  } = $props();
</script>

<div data-title>{title}</div>
<div data-value>
  {@render children?.()}
</div>

{#if separator}
  <div class='col-span-2'>
    <ExSeparator />
  </div>
{/if}

<style>
  [data-title] {
    padding: 3px 0px;
    font-size: 11px;
    font-weight: 500;
    color: var(--qt-text-muted);
    min-width: 60px;
    flex-shrink: 0;
    line-height: 18px;
  }

  [data-value] {
    padding: 3px 0px;
    font-size: 11px;
    color: var(--qt-text-default);
    line-height: 18px;
    word-break: break-word;
  }
</style>
