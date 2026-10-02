// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { WebviewDispatcher } from '@/webview/dispatcher';
import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcher {
  public constructor(
    extContext: ExtContext,
    panel: Panel,
  ) {
    super(consts.AppId, panel);

    void extContext;
    this.setHandlers([]);
  }

  public override dispose() {
    super.dispose();
  }
}
