// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import {
  env,
  Uri,
  WebviewPanel as Panel,
  ExtensionMode as Mode,
  ExtensionContext as Context,
} from 'vscode';

import {
  isHistoryEdit,
  isBookmarkEdit,
  OpenOptions,
  UiState
} from '@/webview/shared/doc-viewer';
import { WebviewDispatcher } from '@/webview/dispatcher';
import { Command, CommandId } from '@/webview/shared/message';
import { openDocViewer } from './controller';
import { DocViewerHttpServer } from './server/http-server';
import { DocViewerHistoryManager } from './history-manager';
import { DocViewerBookmarkManager } from './bookmark-manager';

export class DocViewerDispatcher extends WebviewDispatcher  {
  private readonly _viewerState: UiState = {};
  private readonly _histories: DocViewerHistoryManager;
  private readonly _bookmarks: DocViewerBookmarkManager;

  public constructor(
    private readonly _extContext: Context,
    private readonly _panel: Panel,
    private readonly _docServer: DocViewerHttpServer,
    private readonly _openOptions: OpenOptions
  ) {
    super('doc-viewer', _panel);

    this._histories = new DocViewerHistoryManager(this._extContext.globalState);
    this._bookmarks = new DocViewerBookmarkManager(this._extContext.globalState);
    this.setHandlers([
      [CommandId.DocViewerGetConfig, this._onGetConfig],
      [CommandId.DocViewerSetViewerState, this._onSetViewerState],
      [CommandId.DocViewerOpenUriExt, this._onOpenUriExt],
      [CommandId.DocViewerOpenInNewViewer, this._onOpenInNewViewer],
      [CommandId.DocViewerGetBookmarks, this._onGetBookmarks],
      [CommandId.DocViewerEditBookmarks, this._onEditBookmarks],
      [CommandId.DocViewerGetHistories, this._onGetHistories],
      [CommandId.DocViewerEditHistories, this._onEditHistories],
    ]);

    if (this._extContext.extensionMode === Mode.Development) {
      this._docServer.onCssChanged(() => {
        this.channel.notify(CommandId.DocViewerReloadPage);
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
      openOptions: this._openOptions,
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
    const uri = Uri.parse(String(_.get(cmd.payload, 'uri', '')));
    const openOptions: OpenOptions = {
      trigger: this._openOptions.trigger,
      syncPanelTitle: true,
      forceNewWindow: true
    };

    void openDocViewer(uri, openOptions);
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
