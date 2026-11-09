// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { QtExtSettingItem } from "./types";

const item = <T>(key: string) => new QtExtSettingItem<T>('qt-core', key);

export const core = {
  // contributes > configuration
  openDocExt: item<boolean>('openOnlineDocumentationInExternalBrowser'),
  defaultProjectDir: item<string>('defaultProjectDirectory'),
  enableQrcEditor: item<boolean>('enableQrcEditor'),
  showWelcomePage: item<boolean>('showWelcomePageOnActivation'),
  customUiDesigner: item<string>('customWidgetsDesignerExePath')
};
