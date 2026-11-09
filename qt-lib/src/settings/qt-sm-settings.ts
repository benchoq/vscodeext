// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QtExtSettingItem } from "./types";

const item = <T>(key: string) => new QtExtSettingItem<T>('qt-sm', key);

export const sm = {
  getStartedDone: item<boolean>('getStartedDone'),
}