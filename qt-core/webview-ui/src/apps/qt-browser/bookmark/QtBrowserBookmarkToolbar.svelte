<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { TrashIcon, Square, SquareMinus, SquareCheck } from "@lucide/svelte";
  import * as viewlogic from '../viewlogic.svelte';
  import { data } from '../states.svelte';

  const all = $derived(data.bookmarks.length);
  const checkedCount = $derived(data.bookmarks.filter((e) => e.checked).length);

  const [checkState, CheckIcon] = $derived.by(() => {
    if (checkedCount === 0) {
      return ['empty', Square];
    } else if (checkedCount === all) {
      return ['all', SquareCheck];
    } else {
      return ['partial', SquareMinus];
    }
  });
</script>

<div class='flex flex-row h-[32px] items-center gap-2'>
  <button
    type="button"
    aria-label="check"
    onclick={() => {
      const checkAll = (checkState === 'empty') || (checkState === 'partial');
      viewlogic.bookmark.setAllChecked(checkAll);
    }}
  >
    <CheckIcon />
  </button>

  <button
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.bookmark.edit({
        action: 'remove',
        selection: $state.snapshot(viewlogic.bookmark.getSelection())
      });
    }}
  >
    <TrashIcon />Remove
  </button>
</div>
