// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QtExtSettingItem } from "./types";

const item = <T>(key: string) => new QtExtSettingItem<T>('qt-qml', key);

export const qml = {
  // contributes > configuration
  qmlls: {
    doNotAskDownload: item<boolean>('doNotAskForQmllsDownload')
  },

  profiler: {
    additionalArgs: item<string[]>('profiler.args'),
    customTraceViewer: item<string>('profiler.customTraceViewerExePath')
  },

  preview: {
    additionalArgs: item<string[]>('preview.args'),
    additionalDirs: item<string[]>('preview.additionalBuildDirs')
  }
};
