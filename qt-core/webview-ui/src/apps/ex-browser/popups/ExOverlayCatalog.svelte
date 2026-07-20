<!--
Copyright (C) 2026 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import ExCatalogHeader from './ExCatalogHeader.svelte';
  import ExCatalogFooter from './ExCatalogFooter.svelte';
  import ExCatalogQtVersions from './ExCatalogQtVersions.svelte';
  import ExCatalogCategories from './ExCatalogCategories.svelte';
</script>

<div class='panel flex flex-col'>
  <ExCatalogHeader />

  <div class='flex flex-row'>
    <ExCatalogQtVersions />
    <ExCatalogCategories />
  </div>

  <ExCatalogFooter />
</div>

<style>
  .panel {
    /* width: 480px; */
    background: var(--qt-bg-subtle);
    border: 1px solid var(--qt-stroke-subtle);
    border-radius: var(--qt-radius-m);
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    overflow: hidden;
  }
</style>
