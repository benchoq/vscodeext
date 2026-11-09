// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QtExtSettingItem } from "./types";

const create = <T>(key: string) => new QtExtSettingItem<T>('qt-core', key);

export const core = {
  profiler: {
    openSourceOnSelect: create<boolean>('profiler.openSourceOnSelect'),
    additionalFolders: create<string[]>('profiler.additionalBuildDirs')
  },
};

