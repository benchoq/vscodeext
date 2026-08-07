<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { nanoid } from 'nanoid';
  import { CircleMinus, Info } from '@lucide/svelte';

  let {
    value = $bindable(''),
    level = '',
    message = undefined as string | undefined,
    onInput = () => {},
    onEnter = () => {},
    ...restProps
  } = $props();

  const id = `input_${nanoid()}`;
  let focused = $state(false);
  let forceShowAlert = $state(false);
  let hasIssue = $derived(message !== undefined && message.length > 0);

  export function focus() {
    document.getElementById(id)?.focus();
  }

  function onFocusChange(e: FocusEvent) {
    focused = e.type === 'focus';
    if (e.type === 'focus') {
      (e.target as HTMLInputElement).select();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onEnter();
    }
  }

  function onAlertIconHover(e: MouseEvent) {
    forceShowAlert = e.type === 'mouseenter';
  }
</script>

<div class="w-full relative">
  {#if hasIssue && (focused || forceShowAlert)}
    {@render AlertMessage()}
  {/if}

  <input
    {id}
    bind:value
    type='text'
    class='qt-input w-full'
    data-validation={level}
    onblur={onFocusChange}
    onfocus={onFocusChange}
    oninput={() => { onInput(); }}
    onkeydown={onKeyDown}
    {...restProps}
  />

  {#if hasIssue}
    {@render AlertIcon(level)}
  {/if}
</div>

<!-- snippets -->
{#snippet AlertMessage()}
  <div
    data-role='alert-message'
    class='w-full absolute top-full z-10'
  >
    {message}
  </div>
{/snippet}

{#snippet AlertIcon(level: string)}
{@const Icon = (level === 'error' ? CircleMinus : Info)}
  <button
    class='absolute top-1/2 -translate-y-1/2 right-[7px]'
    data-role='alert-icon'
    data-level={level}
    onmouseenter={onAlertIconHover}
    onmouseleave={onAlertIconHover}
  >
    <Icon size={14}/>
  </button>
{/snippet}

<style>
  .qt-input {
    height: 28px;
    padding: 0px 6px;

    &[data-validation='error'],
    &[data-validation='warning'] {
      padding-right: 25px;
    }
  }

  [data-role='alert-message'] {
    padding: 5px;
    margin: -2px 0 0 0;
    border: 1px solid red;
    color: var(--qt-text-default);
    background: color-mix(in srgb, red 85%, transparent);
    opacity: 0.8;
  }

  [data-role='alert-icon'] {
    &[data-level='error'] {
      color: red;
    }

    &[data-level='warning'] {
      color: orange;
    }
  }
</style>
