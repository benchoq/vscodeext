<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Check } from '@lucide/svelte';
  import * as icons from '@/icons';
  import { clickOutside, portal } from '@/utils/actions';

  import { ui } from '../states.svelte';
  import ExCheckBox from '../others/ExCheckBox.svelte';
  import ExValidationInput from '../others/ExValidationInput.svelte';

  let compNameInput: ExValidationInput;
  const controller = $derived(ui.input);
  const states = $derived(controller.states);
  let showCreateOption = $state(false);
  // const openInOptions = [
    // { value: 'newWindow', label: texts.wizard.openInOptions.newWindow },
    // { value: 'addToWorkspace', label: texts.wizard.openInOptions.addToWorkspace }
  // ];


  let menu = $state(undefined as HTMLElement | undefined);
  let button: HTMLElement;
  let menuStyle = $state('');
  let menuText = $derived.by(() => {
    return (ui.input.states.openIn === 'newWindow')
      ? 'Create and open in new window'
      : 'Create and add to workspace';
  })

  async function toggleMenu() {
    showCreateOption = !showCreateOption;

    if (showCreateOption) {
      await tick();
      const rect = button.getBoundingClientRect();
      const menuWidth = menu?.getBoundingClientRect().width ?? 0;

      menuStyle = `
        position: fixed;
        top: ${rect.bottom}px;
        left: ${rect.right - menuWidth}px;
      `;
    }
  }

  function position(node: HTMLElement, anchor: HTMLElement) {
    requestAnimationFrame(() => {
      const a = anchor.getBoundingClientRect();
      const n = node.getBoundingClientRect();

      node.style.position = 'fixed';
      node.style.top = `${a.bottom + 3}px`;
      node.style.left = `${a.right - n.width}px`;
    });
  }

  function onInput() {
    controller.fireEvent('inputChanged');
  }

  onMount(() => {
    if (compNameInput) {
      compNameInput.focus();
    }
  })

</script>

<div
  data-comp='side-panel'
  data-comp-root
  class='flex flex-col gap-[13px]'
>
  <span>
    Keeps your changes out of the Qt install folder,
    so a Qt update can’t overwrite them.
  </span>

  <!-- name -->
  <div class='flex flex-col gap-[3px]'>
    <div data-role='input-field-name'>Project Name</div>
    <ExValidationInput
      bind:this={compNameInput}
      bind:value={states.name}
      level={states.issues.name.level}
      message={states.issues.name.message}
      onInput={onInput}
    />
  </div>

  <!-- working dir -->
  <div class='flex flex-col gap-[3px]'>
    <div data-role='input-field-name'>Create in</div>
    <div class="w-full flex flex-row items-center gap-[3px] relative">
      <ExValidationInput
        bind:value={states.workingDir}
        level={states.issues.workingDir.level}
        message={states.issues.workingDir.message}
        onInput={onInput}
      />

      <button
        data-role='browse-dir'
        data-validation={states.issues.workingDir.level}
        class='qt-button h-full absolute top-1/2 -translate-y-1/2'
        onclick={() => {
          controller.fireEvent('browseClicked');
        }}
      >
        <icons.FolderOpen />
      </button>
    </div>

    <ExCheckBox
      text='Use as default project directory'
    />
  </div>

  {@render CreateButtonAndOptions()}

  {#if showCreateOption}
    <div
      bind:this={menu}
      use:portal
      use:position={button}
      use:clickOutside={(e: MouseEvent) => {
        e.stopPropagation();
        toggleMenu();
      }}
      class='qt-dropdown flex flex-col'
      style={menuStyle}
    >
      {@render Item('Open in new window', 'newWindow')}
      {@render Item('Add to workspace', 'addToWorkspace')}
    </div>
  {/if}
</div>

{#snippet CreateButtonAndOptions()}
  <div class='flex flex-row gap-[3px]'>
    <div class='grow'></div>
    <button
      data-variant='primary'
      class='qt-button'
      disabled={!states.acceptable}
      onclick={() => {
        controller.fireEvent('createClicked');
      }}
    >
      {menuText}
    </button>

    <button
      bind:this={button}
      data-variant='primary'
      class='qt-button w-[30px]'
      disabled={!states.acceptable}
      onclick={toggleMenu}
    >
      {icons.Glyphs.triangleDown}
    </button>
  </div>
{/snippet}

{#snippet Item(text: string, openIn: 'newWindow' | 'addToWorkspace')}
  <button
    data-role='dropdown-item'
    class='flex flex-row items-center'
    onclick={() => {
      controller.fireEvent('openInChanged', openIn);
      ui.input.states.openIn = openIn;
      showCreateOption = false;
    }}
  >
    {#if ui.input.states.openIn === openIn}
      <Check size={14} />
    {:else}
      <div class='w-[14px]'></div>
    {/if}
    {text}
  </button>
{/snippet}

<style>
  [data-comp-root] {
    padding: 10px;
    background: var(--qt-button-secondary-bg);
  }

  [data-role='input-field-name'] {
    color: var(--qt-text-muted);
  }

  [data-role='dropdown-item'] {
    gap: 8px;
    width: 100%;
    padding: 5px 10px;
    background: none;
    border: none;
    color: var(--qt-dropdown-fg);
    cursor: pointer;
    text-align: left;

    &:hover {
      background: var(--qt-selected-bg);
      color: var(--qt-selected-fg);
    }
  }

  .qt-button {
    &[data-role='browse-dir'] {
      padding: 0 8px 0 0;
      background: none;
      border: none;
      border-radius: 0;
      right: 0px;
    }
  }
</style>
