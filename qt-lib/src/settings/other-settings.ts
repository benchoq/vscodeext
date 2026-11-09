// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { SettingItem } from "./types";

const item =
  <T>(section: string, key: string) => new SettingItem<T>(section, key);

export const others = {
  dialogDefaultPath: item<string>('files', 'dialog.defaultPath'),
  editorAssociations: item<Record<string, string>>(
    'workbench', 'editorAssociations'
  )
};
