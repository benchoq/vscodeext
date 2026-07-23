<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  let {
    text = '',
    plain = false,
    onClicked = () => {}
  } = $props();

</script>

{#if text.length > 0}
  <button
    class='ex-tag-chip inline-flex flex-row gap-[4px]'
    onclick={() => {
      onClicked();
    }}
    >
    {#if plain}
      <span data-name>{text}</span>
    {:else}
      <span data-hash>#</span>
      <span data-name>{text}</span>
      <span data-close>x</span>
    {/if}
  </button>
{/if}

<style>
  .ex-tag-chip {
    height: 20px;
    padding: 0 5px 0 7px;
    border-radius: var(--qt-radius-s);
    background: rgba(0,122,204,0.22);
    border: 1px solid rgba(0,122,204,0.55);
    color: var(--qt-accent-active);
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-family: inherit;
    white-space: nowrap;
    transition: background 80ms;

    &:hover {
      background: rgba(0,122,204,0.35);
    }

    & > [data-hash] {
      opacity: 0.6;
      font-size: 10px;
      margin-right: -2px;
    }

    & > [data-name] {
      font-size: 10px;
      letter-spacing: 0;
    }

    & > [data-close]{
      opacity: 0.55;
      font-size: 11px;
      line-height: 1;
      margin-top: -0.5px;
    }
  }
</style>
