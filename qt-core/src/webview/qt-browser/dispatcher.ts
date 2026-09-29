// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  WebviewPanel as Panel,
  ExtensionContext as Context,
} from 'vscode';

import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';

export class QtBrowserDispatcher extends WebviewDispatcher  {
  public constructor(
    private readonly _extContext: Context,
    panel: Panel,
  ) {
    super('qt-browser', panel);

    this.setHandlers([
      [CommandId.QtBrowser, this._onQtBrowser]
    ]);

    void this._extContext;
  }

  public override dispose() {
    super.dispose();
  }

  private readonly _onQtBrowser = (cmd: Command) => {
    this.channel.replyDone(cmd);
  };
}
