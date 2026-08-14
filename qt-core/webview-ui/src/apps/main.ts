// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { mount } from 'svelte';

const load = () => {
  const appType = document.body.dataset.app;
  switch (appType) {
    case 'welcome':
      return import('./welcome/WelcomeApp.svelte');
    case 'courses':
      return import('./courses/CoursesApp.svelte');
    case 'qrc-editor':
      return import('./qrc-editor/QrcEditorApp.svelte');
    case 'qml-trace':
      return import('./qml-trace/QmlTraceApp.svelte');
    case 'ex-browser':
      return import('./ex-browser/ExBrowserApp.svelte');
    default:
      return import('./new-item/NewItemApp.svelte');
  }
};

load().then(({ default: appToMount }) => {
  mount(appToMount, {
    target: document.getElementById('app')!
  });
});
