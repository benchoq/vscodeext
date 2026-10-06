// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  env,
  commands,
  Uri,
  WebviewPanel as Panel,
  ExtensionMode as Mode,
  ExtensionContext as Context,
} from 'vscode';

import { WebviewDispatcher } from '@/webview/dispatcher';
import {
  isBookmarkEdit,
  isHistoryEdit,
  QtBrowserOpenOptions,
  QtBrowserViewerState
} from '@/webview/shared/qt-browser';
import { Command, CommandId } from '@/webview/shared/message';
import { QtBrowserDocServer } from './server/doc-server';
import { QtBrowserHistoryManager } from './history-manager';
import { QtBrowserBookmarkManager } from './bookmark-manager';

export class QtBrowserDispatcher extends WebviewDispatcher  {
  private readonly _viewerState: QtBrowserViewerState = {};
  private readonly _histories: QtBrowserHistoryManager;
  private readonly _bookmarks: QtBrowserBookmarkManager;

  public constructor(
    private readonly _extContext: Context,
    private readonly _panel: Panel,
    private readonly _docServer: QtBrowserDocServer,
    private readonly _openOptions: QtBrowserOpenOptions
  ) {
    super('qt-browser', _panel);

    this._histories = new QtBrowserHistoryManager(this._extContext.globalState);
    this._bookmarks = new QtBrowserBookmarkManager(this._extContext.globalState);
    this.setHandlers([
      [CommandId.QtBrowserGetConfig, this._onGetConfig],
      [CommandId.QtBrowserSetViewerState, this._onSetViewerState],
      [CommandId.QtBrowserOpenUriExt, this._onOpenUriExt],
      [CommandId.QtBrowserOpenInNewViewer, this._onOpenInNewViewer],
      [CommandId.QtBrowserGetBookmarks, this._onGetBookmarks],
      [CommandId.QtBrowserEditBookmarks, this._onEditBookmarks],
      [CommandId.QtBrowserGetHistories, this._onGetHistories],
      [CommandId.QtBrowserEditHistories, this._onEditHistories],
    ]);

    if (this._extContext.extensionMode === Mode.Development) {
      this._docServer.onCssChanged(() => {
        this.channel.notify(CommandId.QtBrowserReloadPage);
      });
    }

    void this._extContext;
    void this._panel;
  }

  public override dispose() {
    super.dispose();
  }

  public get currentUri() {
    return this._viewerState.uri;
  }

  private readonly _onGetConfig = (cmd: Command) => {
    this.channel.replyData(cmd, {
      homeUri: this._openOptions.homeUrl ?? '',
      serverOrigin: this._docServer.origin,
    });
  };

  private readonly _onSetViewerState = (cmd: Command) => {
    this._viewerState.uri = String(_.get(cmd.payload, 'uri', ''));
    this._viewerState.title = String(_.get(cmd.payload, 'title', ''));

    if (this._openOptions.syncPanelTitle === true) {
      this._panel.title = this._viewerState.title;
    }

    this.channel.replyDone(cmd);
  }

  private readonly _onOpenUriExt = (cmd: Command) => {
    env.openExternal(Uri.parse(String(_.get(cmd.payload, 'uri', ''))));
    this.channel.replyDone(cmd);
  }

   private readonly _onOpenInNewViewer = (cmd: Command) => {
    const uri = String(_.get(cmd.payload, 'uri', ''));
    const openCmd = 'qt-core.openQtBrowser';
    const openOptions: QtBrowserOpenOptions = {
      trigger: 'doc-viewer',
      syncPanelTitle: true,
      forceNewWindow: true
    };

    void commands.executeCommand(openCmd, uri, openOptions);
    this.channel.replyDone(cmd);
  }

  private readonly _onGetBookmarks = (cmd: Command) => {
    this.channel.replyData(cmd, { entries: this._bookmarks.entries });
  }

  private readonly _onEditBookmarks = (cmd: Command) => {
    const edit = _.get(cmd.payload, 'edit', {});
    if (!isBookmarkEdit(edit)) {
      return;
    }

    const affected = this._bookmarks.edit(edit);
    if (affected) {
      this._bookmarks.save();
    }

    this.channel.replyData(cmd, { entries: this._bookmarks.entries });
  }

    private readonly _onGetHistories = (cmd: Command) => {
      this.channel.replyData(cmd, { entries: this._histories.entries });
    }

    private readonly _onEditHistories = (cmd: Command) => {
      const edit = _.get(cmd.payload, 'edit', {});
      if (!isHistoryEdit(edit)) {
        return;
      }

      const affected = this._histories.edit(edit);
      if (affected) {
        this._histories.save();
      }

      this.channel.replyData(cmd, { entries: this._histories.entries });
    }
}
