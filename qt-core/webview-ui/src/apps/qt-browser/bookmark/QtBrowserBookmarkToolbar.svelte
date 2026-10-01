<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { TrashIcon, Trash2Icon } from "@lucide/svelte";
  import * as helpers from '../helpers';
  import * as viewlogic from '../viewlogic.svelte';
</script>

<div class='flex flex-row h-[32px] gap-1'>
  <button
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.editBookmark({ action: 'clear' });
    }}
  >
    <Trash2Icon />Remove All
  </button>

  <button
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.editBookmark({
        action: 'remove',
        selection: $state.snapshot(helpers.findBookmarkSelectedEntries())
      });
    }}
  >
    <TrashIcon />Remove selected
  </button>
</div>
