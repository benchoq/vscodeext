<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as utils from '@/utils/utils';
  import { ui } from '../states.svelte';
  import ExTagList from '../others/ExTagList.svelte';

  const example = $derived(ui.selected.example);

</script>

<div class='grid grid-cols-[max-content_1fr]'>
  <div data-title>Qt</div>
  <div data-value>
    {utils.extractQtVersion(ui.selected.package?.name ?? '')}
  </div>

  <div data-title>Category</div>
  <div data-value>
    {#each example?.categories as cat (cat)}
      <div>{cat}</div>
    {/each}
  </div>

  <div data-title>Module</div>
  <div data-value>
    {utils.addSpaceBeforeUppercase(example?.module ?? '')}
  </div>

  <div data-title>Location</div>
  <div data-value data-is-path>{example?.projectPath ?? ''}</div>

  <div data-title>Tags</div>
  <div data-value>
    <ExTagList
      usage='details'
      tags={example?.tags}
    />
  </div>
</div>

<style>
  [data-title] {
    padding: 3px 0px;
    font-size: 11px;
    font-weight: 500;
    color: var(--qt-text-muted);
    min-width: 60px;
    flex-shrink: 0;
    line-height: 18px;
    border-bottom: 1px solid var(--qt-stroke-subtle);
  }

  [data-value] {
    padding: 3px 0px;
    font-size: 11px;
    color: var(--qt-text-default);
    line-height: 18px;
    word-break: break-word;
    border-bottom: 1px solid var(--qt-stroke-subtle);

    &[data-is-path] {
      direction: rtl;
      text-align: left;
      unicode-bidi: embed;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
    }
  }
</style>
