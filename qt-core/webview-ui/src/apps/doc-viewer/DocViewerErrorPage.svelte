<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { ArrowLeft, TriangleAlert } from '@lucide/svelte';

  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
</script>

<div class='w-full h-full flex flex-col items-center justify-center gap-2'>
  <div class='flex flex-row gap-2'>
    <TriangleAlert size={24} />
    <span>Cannot find the page (code = {ui.iframe.errorCode})</span>
  </div>

  <span>
    You might need to install the Qt modules missing to read this documentation
  </span>

  <button
    data-variant='primary'
    class='qt-button flex flex-row min-w-[100px] min-h-[50px] items-center justify-center mt-5'
    onclick={() => {
      viewlogic.openDoc(ui.history.currentEntry.uri);
    }}
  >
    <ArrowLeft />Back
  </button>
</div>
