// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { data } from './states.svelte';

export function toLocalServerUri(uri: string) {
  if (uri.startsWith('file:')) {
    try {
      const u = new URL(uri);
      return `${data.configs.serverOrigin}${u.pathname}${u.hash}`;
    } catch (e) {
      void e;
    }
  }

  return uri;
}

export function toFileUri(uri: string) {
  if (uri.startsWith(data.configs.serverOrigin)) {
    try {
      const u = new URL(uri);
      return `file://${u.pathname}${u.hash}`;
    } catch (e) {
      void e;
    }
  }

  return uri;
}

export function extractHash(uri: string) {
  try {
    const u = new URL(uri);
    return u.hash;
  } catch (e) {
    void e;
  }

  return '';
}
