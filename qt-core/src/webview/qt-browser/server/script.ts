// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ViewerMessageId } from '@/webview/shared/qt-browser';

let cached: string | undefined;

export function getScriptToInject() {
  if (!cached) {
    const all = [
      CommonScript,
      FindInPageScript,
      ReloadScript,
      ThemeScript,
      LoadedScript,
      LinkClickScript,
      LinkHoverScript,
      KeyForwardScript,
      ContextMenuScript,
    ];

    cached = /*html*/`
      <script>
        ${all.join('\n')}
      </script>
    `;
  }

  return cached;
}

// all scripts to inject
const CommonScript = /*js*/`
  function notifyParent(id, fields) {
    window.parent.postMessage({ id, ...fields }, '*');
  }

  function addListener(eventName, handler) {
    window.addEventListener(eventName, handler, true);
  }

  function addListenerNoCapture(eventName, handler) {
    window.addEventListener(eventName, handler, false);
  }

  function onParentMessage(id, handler) {
    addListenerNoCapture('message', (e) => {
      if (e.data?.id === id) {
        handler(e.data);
      }
    });
  }
`;

const FindInPageScript = /*js*/`
  function findInPage(keyword, dir) {
    return window.find(
      keyword,
      false, // caseSensitive
      dir === 'backward',
      true, // wrapAround
      false, // wholeWord
      false, // searchInFrames
      false, // showDialog
    );
  }

  onParentMessage('${ViewerMessageId.FindInPage}', ({ keyword, action }) => {
    switch (action) {
      case 'new':
        window.getSelection()?.removeAllRanges();
        findInPage(keyword, 'forward');
        break;

      case 'prev':
        findInPage(keyword, 'backward');
        break;

      case 'next':
        findInPage(keyword, 'forward');
        break;

      case 'clear':
        window.getSelection()?.removeAllRanges();
        break;
    }
  });
`;

const ReloadScript = /*js*/`
  onParentMessage('${ViewerMessageId.ReloadPage}', () => {
    location.reload();
  });
`;

const ThemeScript = /*js*/`
  onParentMessage('${ViewerMessageId.ApplyVscodeTheme}', ({ vars }) => {
    for (const [name, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(name, value);
    }
  });
`;

const LoadedScript = /*js*/`
  addListenerNoCapture('load', () => {
    notifyParent('${ViewerMessageId.ViewerLoaded}', {
      title: document.title,
      href: location.href,
      hash: location.hash,
      pathname: location.pathname,
    });
  });
`;

const LinkClickScript = /*js*/`
  addListenerNoCapture('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) {
      return;
    }

    const url = new URL(anchor.href, document.baseURI);
    notifyParent('${ViewerMessageId.ViewerClicked}', { href: url.href });

    e.preventDefault();
  });
`;

const LinkHoverScript = /*js*/`
  function onMouseInOut(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const link = e.target.closest('a');
    const isLeavingWithinLink = (e.type === 'mouseout')
      && link
      && e.relatedTarget
      && link.contains(e.relatedTarget);

    if (!link || isLeavingWithinLink) {
      return;
    }

    notifyParent('${ViewerMessageId.ViewerHoverChanged}', {
      href: (e.type === 'mouseover') ? link.href : '',
    });
  }

  addListenerNoCapture('mouseout', onMouseInOut);
  addListenerNoCapture('mouseover', onMouseInOut);
`;

const KeyForwardScript = /*js*/`
  addListener('keydown', (e) => {
    notifyParent('${ViewerMessageId.ViewerKeyDown}', {
      fields: {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        repeat: e.repeat,
      },
    });
  });
`;

const ContextMenuScript = /*js*/`
  addListener('contextmenu', (e) => {
    e.preventDefault();
    notifyParent('${ViewerMessageId.ViewerContextMenu}', {
      x: e.clientX,
      y: e.clientY
    });
  });

  addListener('mousedown', () => {
    notifyParent('${ViewerMessageId.ViewerMouseDown}');
  });
`;
