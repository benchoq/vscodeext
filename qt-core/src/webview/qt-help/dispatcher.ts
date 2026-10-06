// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  WebviewPanel as Panel,
  ExtensionContext as ExtContext
} from 'vscode';

import { Command, CommandId } from '@/webview/shared/message';
import { WebviewDispatcher, WebviewDispatcherChain } from '@/webview/dispatcher';
import { QtBrowserDispatcher } from '@/webview/qt-browser/dispatcher';
import { QtBrowserDocServer } from '@/webview/qt-browser/server/doc-server';
import { QtHelpDataManager } from './data/data-manager';

import * as consts from './constants';

export class QtHelpDispatcher extends WebviewDispatcherChain {
  private readonly _docServer: QtBrowserDocServer;
  private readonly _viewerDispatcher: QtBrowserDispatcher;

  public constructor(extContext: ExtContext, panel: Panel) {
    super();

    this._docServer = new QtBrowserDocServer(extContext);
    void this._docServer.start();

    this._viewerDispatcher = new QtBrowserDispatcher(
      extContext, panel, this._docServer, {
        trigger: "qt-help",
        syncPanelTitle: false
      }
    );

    this.appendDispatchers(
      this._viewerDispatcher,
      new QtHelpOwnDispatcher(panel)
    )
  }
}

class QtHelpOwnDispatcher extends WebviewDispatcher {
  private readonly _data: QtHelpDataManager;

  public constructor(panel: Panel) {
    super(consts.AppId, panel);

    this._data = new QtHelpDataManager();
    this.setHandlers([
      [CommandId.QtHelpReadToc, this._onReadToc],
      [CommandId.QtHelpReadIndexes, this._onReadIndexes],
      [CommandId.QtHelpSearchFullText, this._onSearchFullText]
    ]);
  }

  private readonly _onReadToc = async (cmd: Command) => {
    const data = await this._data.readToc();
    this.channel.replyData(cmd, data);
  };

  private readonly _onReadIndexes = async (cmd: Command) => {
    const data = await this._data.readIndexes();
    this.channel.replyData(cmd, data);
  };

  private readonly _onSearchFullText = async (cmd: Command) => {
    const keyword = String(_.get(cmd.payload, 'keyword', '')).trim();

    const data = await this._data.searchFullText(keyword);
    this.channel.replyData(cmd, data);
  };
}
