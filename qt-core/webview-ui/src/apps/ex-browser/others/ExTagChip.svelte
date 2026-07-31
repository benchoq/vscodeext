<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    text = '',
    type = 'plain' as 'blue' | 'gray' | 'hallow',
    plain = false,
    onClicked = () => {}
  } = $props();

</script>

{#if text.length > 0}
  <button
    data-root
    class='inline-flex'
    onclick={() => {
      onClicked();
    }}
    >
    {#if plain}
      <span data-name>{text}</span>
    {:else}
      <span data-hash>#</span>
      <span data-name>{text}</span>
      <span data-close>&times;</span>
    {/if}
  </button>
{/if}

<style>
  [data-root] {
    height: 20px;
    padding: 0 5px 0 7px;
    border-radius: var(--qt-radius-s);
    background: var(--accent-blue-a22);
    border: 1px solid var(--accent-blue-a55);
    color: var(--qt-accent-active);
    cursor: pointer;
    align-items: center;
    gap: 4px;
    transition: background var(--duration-short);

    &:hover {
      background: var(--accent-blue-a35);
    }

    & > [data-hash] {
      opacity: 0.6;
      font-size: 10px;
      margin-right: -2px;
    }

    & > [data-name] {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0;
      white-space: nowrap;
    }

    & > [data-close]{
      opacity: 0.55;
      font-size: 15px;
      line-height: 1;
      margin-top: -0.5px;
    }
  }
</style>
