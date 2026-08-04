<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import * as utils from '@/utils/utils';
  import { ui } from '../states.svelte';
  import TableRow from './ExDetailsTableRow.svelte';
  import ExTagList from '../others/ExTagList.svelte';
  import ExDetailsFileLists from './ExDetailsFileLists.svelte';

  const example = $derived(ui.selected.example);
</script>

<div class='grid grid-cols-[max-content_1fr]'>
  <TableRow title='Qt'>
    {utils.extractQtVersion(ui.selected.package?.name ?? '')}
  </TableRow>

  <TableRow title='Module'>
    {utils.addSpaceBeforeUppercase(example?.module ?? '')}
  </TableRow>

  <TableRow title='Project'>
    <ExDetailsFileLists />
  </TableRow>

  <TableRow title='Category'>
    {#each example?.categories as cat (cat)}
      <div>{cat}</div>
    {/each}
  </TableRow>

  <TableRow title='Tags' separator={false}>
    <ExTagList
      usage='details'
      tags={example?.tags}
    />
  </TableRow>
</div>
