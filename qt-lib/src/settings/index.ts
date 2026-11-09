// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { core } from "./qt-core-settings";
import { sm } from "./qt-sm-settings";
import { qml } from "./qt-qml-settings";
import { python } from './qt-python-settings';
import { others } from './other-settings';

export const settings = {
  core,
  sm,
  qml,
  python,
  others
} as const;
