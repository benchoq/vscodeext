<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    text = '',
    keyword = ''
  } = $props();

  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function splitByKeyword(text: string, keyword: string) {
    // text = 'Qt Quick Controls'
    // keyword = 'quick qt'
    //
    // the expected output will be like:
    // [
    //   { text: 'Qt', match: true },
    //   { text: ' ', match: false },
    //   { text: 'Quick', match: true },
    //   { text: ' Controls', match: false }
    // ]

    const words = keyword.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [{ text, match: false }];
    }

    const re = new RegExp(`(${words.map(escape).join('|')})`, 'gi');
    return text
      .split(re)
      .map((t, i) => ({ text: t, match: i % 2 === 1 }))
      .filter((s) => s.text);
  }

  const parsed = $derived(splitByKeyword(text, keyword));

</script>

{#each parsed as s, i (i)}
  {#if s.match}
    <mark>{s.text}</mark>
  {:else}
    {s.text}
  {/if}
{/each}

<style>
  mark {
    color: var(--qt-button-fg);
    background: var(--qt-button-primary-bg);
    border-radius: var(--qt-radius-s);
    padding: 1px;
  }
</style>
