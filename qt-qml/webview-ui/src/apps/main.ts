// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { mount } from 'svelte';

import QmlTrace from './qml-trace/QmlTraceApp.svelte';

const appType = document.body.dataset.app;
const appComp = (() => {
  switch (appType) {
    case 'qml-trace': return QmlTrace;
    default:
      return QmlTrace;
  }
})();

const app = mount(appComp, {
  target: document.getElementById('app')!
});

export default app;
