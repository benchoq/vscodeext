// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  commands,
  ExtensionContext as Context
} from 'vscode';

import { telemetry } from 'qt-lib';
import { QtBrowserController } from './controllers-manager';
import * as consts from './constants';

const controller = new QtBrowserController();

export function addQtBrowser(context: Context) {
  const openCmd = 'openQtBrowser';
  const openCmdFull = `${consts.EXTENSION_ID}.${openCmd}`;

  controller.init(context);

  context.subscriptions.push(
    commands.registerCommand(openCmdFull, () => {
      telemetry.sendAction(openCmd);
      controller.open(context);
    })
  );
}
