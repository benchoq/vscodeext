// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QtExtSettingItem } from "./types";

const item = <T>(key: string) => new QtExtSettingItem<T>('qt-python', key);

export const python = {
  // contributes > configuration
  preferUv: item<boolean>('preferUv'),
  noWarnOldStyleProjects: item<boolean>('doNotWarnAboutOldStyleProjects')
};
