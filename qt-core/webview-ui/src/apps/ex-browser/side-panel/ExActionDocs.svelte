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
    class='qt-button flex flex-row grow relative'
    onclick={() => {
      viewlogic.runExAction('doc-open-internal');
    }}
  >
    <FileTag />
    <span class='flex-1'>Read the documentation</span>
    <div class='absolute top-1/2 -translate-y-1/2 right-[4px]'>
      <ExToolButton
        onClicked={(e: MouseEvent) => {
          e.stopPropagation();
          viewlogic.runExAction('doc-open-external');
        }}
      >
        <ExtLink size={12}/>
      </ExToolButton>
    </div>
  </button>
</div>
