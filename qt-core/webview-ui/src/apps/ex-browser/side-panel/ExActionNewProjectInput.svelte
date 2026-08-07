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
    <div class="w-full flex flex-row items-center gap-[3px]">
      <ExValidationInput
        bind:value={states.workingDir}
        level={states.issues.workingDir.level}
        message={states.issues.workingDir.message}
        onInput={onInput}
      />

      <button
        class='qt-button'
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
    height: 28px;
    padding: 0 7px;
    border: none;
    border-radius: var(--qt-radius-s);
  }
</style>

<!-- snippets -->
<!-- {#snippet FieldName(text: string)}
  <P class={`qt-label flex items-center ${fieldNameClass}`}>
    {text}
  </P>
{/snippet}

{#snippet NameInput()}
  <InputWithIssue
    bind:this={elNameInput}
    bind:value={states.name}
    onInput={() => {
      controller.fireEvent('inputChanged');
    }}
    level={states.issues.name.level}
    message={states.issues.name.message}
  />
{/snippet}

{#snippet WorkingDirInput()}
  <div class="w-full grid grid-cols-[min-content_1fr] gap-0">
    <IconButton
      icon={FolderOpen}
      class="qt-button px-2 py-0 rounded-r-none! -mr-0.5 focus:z-1 min-w-[36px]"
      tooltip={texts.wizard.workingDirTooltip}
      onClicked={() => {
        controller.fireEvent('browseClicked');
      }}
      />

    <InputWithIssue
      bind:value={states.workingDir}
      class="rounded-l-none!"
      onInput={() => {
        controller.fireEvent('inputChanged');
      }}
      level={states.issues.workingDir.level}
      message={states.issues.workingDir.message}
    />
  </div>
{/snippet}
-->

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

  <!-- <div class="flex flex-row gap-2">
    {#if selectedType === 'project'}
      <Checkbox
        class="self-start qt-checkbox grow"
        bind:checked={states.saveProjectDir}
      >
        {texts.wizard.workingDirSaveCheckbox}
      </Checkbox>
    {:else}
      <div class="grow"></div>
    {/if}

    {#if selectedType === 'project'}
      <SplitButton
        text={texts.wizard.buttons.create}
        icon={Check}
        disabled={!states.acceptable}
        options={openInOptions}
        bind:selectedValue={states.openIn}
        onClicked={() => {
          controller.fireEvent('createClicked');
        }}
        onValueChanged={() => {
          controller.fireEvent('openInChanged', states.openIn);
        }}
      />
    {:else}
      <IconButton
        class={selectedType === 'project' ? '!rounded-r-none' : ''}
        text={texts.wizard.buttons.create}
        icon={Check}
        disabled={!states.acceptable}
        onClicked={() => {
          controller.fireEvent('createClicked');
        }}
      />
    {/if}
  </div> -->
{/snippet}
