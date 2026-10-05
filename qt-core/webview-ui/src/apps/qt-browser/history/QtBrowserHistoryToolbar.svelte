<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { TrashIcon, Square, SquareMinus, SquareCheck } from "@lucide/svelte";
  import { data } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(data.histories.length);
  const checkedCount = $derived(data.histories.filter((e) => e.checked).length);

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
      viewlogic.history.setAllChecked(checkAll);
    }}
  >
    <CheckIcon />
  </button>

  <button
    class='qt-button flex items-center justify-center'
    onclick={() => {
      viewlogic.history.edit({
        action: 'remove',
        selection: $state.snapshot(viewlogic.history.getSelection())
      });
    }}
  >
    <TrashIcon />Remove
  </button>
</div>
