// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { IframeMessageId } from '@shared/doc-viewer';
import { CommandId, type CommandReply } from '@shared/message';

import { data, ui } from './states.svelte';
import { type FindAction } from './types.svelte';
import * as helpers from './helpers';
import * as history from './viewlogic.history.svelte';
import * as bookmark from './viewlogic.bookmark.svelte';

export { history, bookmark };

export async function onAppMount() {
  ui.theme.monitor.start();
  ui.theme.monitor.onChanged(onVscodeThemeChanged);

  window.addEventListener('keydown', onKeydown);
  window.addEventListener('message', onMessageFromIframe);
  vscode.onDidReceiveNotification(onMessageFromVscode);

  await loadConfigs();
  await history.load();
  await bookmark.load();

  if (data.configs.homeUri.length !== 0) {
    void openUri(data.configs.homeUri);
  }
}

export async function onAppDestroy() {
}

export async function openUri(uri: string) {
  const u = helpers.toLocalServerUri(uri);

  if (!u.startsWith(data.configs.serverOrigin)) {
    void vscode.post(CommandId.DocViewerOpenUriExt, { uri });
    return;
  }

  // TODO: check if it's allowed to access or exists
  ui.iframe.src = u;
  ui.iframe.errorCode = undefined;
}

export function openInNewViewer(uri: string) {
  const u = helpers.toFileUri(uri);
  void vscode.post(CommandId.DocViewerOpenInNewViewer, { uri: u });
}

export function navigate(dir: 'back' | 'forward') {
  const e = ui.history.go(dir);

  if (typeof e?.uri === 'string') {
    openUri(e?.uri);
  }
}

export function copySelection() {
  postToIframe(IframeMessageId.RequestCopySelected);
}

export function setLayerVisible(target: 'bookmark' | 'history', visible: boolean) {
  ui.popovers.history.visible = (target === 'history') && visible;
  ui.popovers.bookmark.visible = (target === 'bookmark') && visible;
}

export function findInPage(action: FindAction) {
  const w = ui.iframe.el?.contentWindow
  if (!w) {
    return;
  }

  if (action === 'clear') {
    ui.popovers.find.keyword = '';
    ui.popovers.find.visible = false;
  }

  postToIframe(IframeMessageId.RequestFindInPage, {
    keyword: ui.popovers.find.keyword,
    action
  });
}

// helpers
async function loadConfigs() {
  const r = await vscode.post(CommandId.DocViewerGetConfig);

  data.configs.homeUri = String(_.get(r, 'homeUri', '')).trim();
  data.configs.serverOrigin = String(_.get(r, 'serverOrigin', '')).trim();
}

function onVscodeThemeChanged() {
  postToIframe(IframeMessageId.RequestApplyVscodeTheme, {
    vars: ui.theme.getAllVscodeCssVars()
  });
}

function onMessageFromVscode(reply: CommandReply) {
  if (reply.id === CommandId.DocViewerReloadPage) {
    postToIframe(IframeMessageId.RequestReloadPage);
  }
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === 'f') {
    ui.popovers.find.visible = true;
  }
}

function onMessageFromIframe(e: MessageEvent) {
  switch (e.data?.id) {
    case IframeMessageId.EventLoaded: {
      ui.iframe.errorCode = e.data.errorCode;

      if (ui.iframe.errorCode) {
        ui.iframe.hoveredUri = '';
        void vscode.post(CommandId.DocViewerSetViewerState, { title: 'Error' });
        return;
      }

      const fileUri = helpers.toFileUri(e.data.href);

      ui.iframe.title = e.data.title;
      ui.iframe.hoveredUri = '';
      ui.history.push({
        uri: e.data.href,
        title: e.data.title
      });

      history.edit({
        action: 'add',
        entry: {
          uri: fileUri,
          title: e.data.title,
        }
      });

      postToIframe(IframeMessageId.RequestApplyVscodeTheme, {
        vars: ui.theme.getAllVscodeCssVars()
      });

      void vscode.post(CommandId.DocViewerSetViewerState, {
        uri: fileUri,
        title: e.data.title
      });
      break;
    }

    case IframeMessageId.EventHoverChanged:
      if (typeof e.data.href === 'string') {
        ui.iframe.hoveredUri = helpers.toFileUri(e.data.href);
      }
      break;

    case IframeMessageId.EventClicked:
      if (typeof e.data?.href === 'string') {
        // TODO: file: vs http: ...
        if (e.data.newWindow === true) {
          openInNewViewer(e.data?.href);
        } else {
          openUri(e.data?.href);
        }
      }
      break;

    case IframeMessageId.EventKeyDown: {
      const fields = e.data.fields;

      if (fields.key.toLowerCase() === 'c') {
        if (fields.metaKey || fields.ctrlKey) {
          postToIframe(IframeMessageId.RequestCopySelected);
          return;
        }
      }

      document.dispatchEvent(new KeyboardEvent('keydown', {
        ...fields,
        bubbles: true,
        cancelable: true,
      }));
      break;
    }

    case IframeMessageId.EventContextMenu: {
      const r = ui.iframe.el?.getBoundingClientRect();
      if (r) {
        const x = r.left + e.data.x;
        const y = r.top + e.data.y;
        ui.popovers.contextMenu.pos = { x, y };
        ui.popovers.contextMenu.visible = true;
      }
      break;
    }

    case IframeMessageId.EventMouseDown:
      ui.popovers.contextMenu.visible = false;
      break;

    default:
      break;
  }
}

function postToIframe(id: IframeMessageId, data = {}) {
  ui.iframe.el?.contentWindow?.postMessage(
    { id, ...data }, '*'
  );
}
