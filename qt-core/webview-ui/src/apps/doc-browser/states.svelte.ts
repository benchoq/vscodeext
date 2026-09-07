// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as VscodeThemeMonitor from '@/comps/VscodeThemeMonitor.svelte';

export const data = $state({
  data: [] as string[],
});

export const ui = $state({
  theme: VscodeThemeMonitor.createController()
});
