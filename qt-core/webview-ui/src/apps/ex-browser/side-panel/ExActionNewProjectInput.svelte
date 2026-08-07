<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import * as icons from '@/icons';
  import * as chars from '@/utils/chars';
  // import P from 'flowbite-svelte/P.svelte';
  // import Checkbox from 'flowbite-svelte/Checkbox.svelte';
  // import { FolderOpen } from '@lucide/svelte';

  // import * as texts from '@/apps/texts';
  // import IconButton from '@/comps/IconButton.svelte';
  // import SplitButton from '@/comps/SplitButton.svelte';
  import { ui } from '../states.svelte';
  // import InputWithIssue from '@/comps/InputWithIssue.svelte';
  // import ExToolButton from '../others/ExToolButton.svelte';
  import ExCheckBox from '../others/ExCheckBox.svelte';
  import ExValidationInput from '../others/ExValidationInput.svelte';
  // import { type NewItemFormController } from '@/comps/NewItemForm.logic.svelte';

  let {
    controller = ui.input
  } = $props();

  let compNameInput: ExValidationInput;
  const states = $derived(controller.states);
  // const openInOptions = [
    // { value: 'newWindow', label: texts.wizard.openInOptions.newWindow },
    // { value: 'addToWorkspace', label: texts.wizard.openInOptions.addToWorkspace }
  // ];

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

  {@render BottomControls()}
</div>

<style>
  [data-comp-root] {
    padding: 10px;
    background: var(--qt-button-secondary-bg);
  }

  [data-role='input-field-name'] {
    color: var(--qt-text-muted);
  }

  .qt-button {
    &[data-role='browse-dir'] {
      padding: 0 7px 0 0;
      background: none;
      border: none;
      border-radius: 0;
      right: 0px;

      &[data-validation='error'],
      &[data-validation='warning'] {
        padding: 0 26px 0 0;
      }
    }
  }
</style>

{#snippet BottomControls()}
  <div class='flex flex-row gap-[3px]'>
    <div class='grow'></div>
    <button
      data-variant='primary'
      class='qt-button'
      onclick={() => {
        controller.fireEvent('createClicked');
      }}
    >
      Create and open
    </button>

    <button
      data-variant='primary'
      class='qt-button w-[30px]'
    >
      {chars.downArrow}
    </button>
  </div>
{/snippet}
