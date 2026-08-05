<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExToolButton from '../others/ExToolButton.svelte';
  import { FileTag, ExtLink } from '@/icons';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-row items-center justify-center'>
  <button
    data-variant='secondary'
    class='qt-button flex flex-row grow'
    onclick={() => {
      viewlogic.runExAction('doc-open-internal');
    }}
  >
    <FileTag />
    <span class='flex-1'>Read the documentation</span>

    <ExToolButton
      onClicked={(e: MouseEvent) => {
        e.stopPropagation();
        viewlogic.runExAction('doc-open-external');
      }}
    >
      <ExtLink size={12}/>
    </ExToolButton>
  </button>
</div>

<style>
  .qt-button {
    height: 24px;
    text-align: left;
    border: none;
  }
</style>
