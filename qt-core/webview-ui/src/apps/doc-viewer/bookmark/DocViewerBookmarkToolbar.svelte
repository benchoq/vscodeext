<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import {
    Square,
    SquareMinus,
    SquareCheck,
    TrashIcon
  } from "@lucide/svelte";

  import { data } from '../states.svelte';
  import * as viewlogic from '../viewlogic.svelte';

  const all = $derived(data.bookmarks.length);
  const selected = $derived(data.bookmarks.filter((e) => e.checked).length);

  const [checkState, CheckIcon] = $derived.by(() => {
    if (selected === 0) {
      return ['empty', Square];
    } else if (selected === all) {
      return ['all', SquareCheck];
    } else {
      return ['partial', SquareMinus];
    }
  });

  const description = $derived.by(() => {
    return checkState === 'empty'
      ? `Total ${all} items`
      : `${selected} of ${all} selected`
  })
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

  <span>{description}</span>

  {#if checkState !== 'empty'}
    <button
      class='qt-button flex items-center justify-center'
      onclick={() => {
        viewlogic.bookmark.edit({
          action: 'remove',
          selection: $state.snapshot(viewlogic.bookmark.getSelection())
        });
      }}
    >
      <TrashIcon />
    </button>
  {/if}
</div>
