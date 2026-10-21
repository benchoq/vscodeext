// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from '@/apps/vscode';
import { IframeMessageId, isOpenOptions, type NamedUri } from '@shared/doc-viewer';
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

  if (data.configs.openOptions.homeUri) {
    void openDoc(data.configs.openOptions.homeUri);
  }
}

export async function onAppDestroy() {
}

export async function reset() {
  setLoadState('', 0);
  ui.iframe.uri = '';
  syncViewerLoadState();
}

export function currentUri() {
  return ui.iframe.uri;
}

export async function openDoc(uri: string, forceNewWindow = false) {
  const r = await vscode.post(CommandId.DocViewerOpenDoc, {
    uri,
    forceNewWindow
  });

  const result = String(_.get(r, 'result', '')).trim();
  const serviceUri = String(_.get(r, 'serviceUri', '')).trim();

  switch (result) {
    case 'load':
      setLoadState('', 0);
      ui.iframe.uri = serviceUri;
      return;

    case 'error':
      setErrorState(String(_.get(r, 'errorCode', '')).trim());
      break;

    case 'sustain':
    default:
      return;
  }

  syncViewerLoadState();
}

export function navigate(dir: 'back' | 'forward') {
  const e = ui.history.go(dir);

  if (typeof e?.uri === 'string') {
    openDoc(e?.uri);
  }
}

export function copySelection() {
  postToIframe(IframeMessageId.RequestCopySelected);
}

export function scrollToTop() {
  postToIframe(IframeMessageId.RequestScrollToTop);
}

export function setSidePanel(mode: 'bookmark' | 'history' | undefined) {
  ui.sidePanel.mode = mode;
}

export function findInPage(action: FindAction) {
  postToIframe(IframeMessageId.RequestFindInPage, {
    keyword: ui.popovers.find.keyword,
    action
  });
}

// helpers
async function loadConfigs() {
  const r = await vscode.post(CommandId.DocViewerGetConfig);
  const opts = _.get(r, 'openOptions', {});
  const server = String(_.get(r, 'serverOrigin', '')).trim();

  if (isOpenOptions(opts)) {
    data.configs.openOptions = opts;
  }

  data.configs.serverOrigin = server;
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

function setLoadState(title: string, scrollTop: number) {
  ui.iframe.title = title;
  ui.iframe.errorCode = '';
  ui.iframe.hoveredUri = '';
  ui.iframe.scrollTop = scrollTop;
}

function setErrorState(errorCode: string) {
  ui.iframe.title = 'Error';
  ui.iframe.errorCode = errorCode;
  ui.iframe.hoveredUri = '';
  ui.iframe.scrollTop = 0;
}

function syncViewerLoadState() {
  void vscode.post(CommandId.DocViewerSetViewerState, {
    uri: helpers.toFileUri(ui.iframe.uri),
    title: ui.iframe.title,
  });
}

function onMessageFromIframe(e: MessageEvent) {
  switch (e.data?.id) {
    case IframeMessageId.EventLoaded: {
      const errorCode = String(_.get(e.data, 'errorCode', '')).trim();
      if (errorCode) {
        setErrorState(errorCode);
      } else {
        const namedUri: NamedUri = {
          uri: helpers.toFileUri(e.data.href),
          title: e.data.title
        };

        setLoadState(namedUri.title, e.data.scrollTop);
        ui.history.push(namedUri);
        history.edit({ action: 'add', entry: namedUri });
        postToIframe(IframeMessageId.RequestApplyVscodeTheme, {
          vars: ui.theme.getAllVscodeCssVars()
        });
      }

      syncViewerLoadState();
      break;
    }

    case IframeMessageId.EventHoverChanged:
      if (typeof e.data.href === 'string') {
        ui.iframe.hoveredUri = e.data.href;
      }
      break;

    case IframeMessageId.EventClicked:
      if (typeof e.data?.href === 'string') {
        openDoc(e.data.href, e.data.newWindow === true);
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

    case IframeMessageId.EventScrolled: {
      ui.iframe.scrollTop = e.data.scrollTop;
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
