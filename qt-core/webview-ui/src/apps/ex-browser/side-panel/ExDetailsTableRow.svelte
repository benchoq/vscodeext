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

<div data-role="row-title">{title}</div>
<div data-role="row-value">
  {@render children?.()}
</div>

{#if separator}
  <div class="col-span-2">
    <ExSeparator />
  </div>
{/if}

<style>
  [data-role='row-title'] {
    padding: 3px 0px;
    min-width: 60px;
    color: var(--qt-text-muted);
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 500;
    line-height: 18px;
  }

  [data-role='row-value'] {
    padding: 3px 0px;
    color: var(--qt-text-default);
    font-size: 11px;
    line-height: 18px;
    word-break: break-word;
  }
</style>
