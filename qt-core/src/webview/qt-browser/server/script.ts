// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { ViewerMessageId } from '@/webview/shared/qt-browser';

export const ScriptToInject = /*html*/`
<script>
  function findInPage(keyword, dir) {
    return window.find(
      keyword,
      false, // caseSensitive
      (dir === 'backward') ? true : false,
      true, // wrapAround
      false, // wholeWord
      false, // searchInFrames
      false, // showDialog
    );
  }

  window.addEventListener('message', (e) => {
    if (e.data?.type === '${ViewerMessageId.FindInPage}') {
      const keyword = e.data.keyword;
      const action = e.data.action;

      switch (action) {
        case 'new':
          window.getSelection()?.removeAllRanges();
          findInPage(e.data.keyword, 'forward');
          break;

        case 'prev':
          findInPage(e.data.keyword, 'backward');
          break;

        case 'next':
          findInPage(e.data.keyword, 'forward');
          break;

        case 'clear':
          window.getSelection()?.removeAllRanges();
          break;
      }
      return;
    }

    if (e.data?.type === '${ViewerMessageId.ReloadPage}') {
      location.reload();
      return;
    }

    if (e.data?.type === '${ViewerMessageId.ApplyVscodeTheme}') {
      for (const [name, value] of Object.entries(e.data.vars)) {
        document.documentElement.style.setProperty(name, value);
      }
      return;
    }
  });

  window.addEventListener('load', (e) => {
    window.parent.postMessage({
      type: '${ViewerMessageId.ViewerLoaded }',
      title: document.title,
      href: location.href,
      hash: location.hash,
      pathname: location.pathname,
    }, '*');
  });

  window.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) {
      return;
    }

    const url = new URL(anchor.href, document.baseURI);
    window.parent.postMessage({
      type: '${ViewerMessageId.ViewerClicked }',
      href: url.href
    }, '*');

    e.preventDefault();
  });

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

    window.parent.postMessage({
      type: '${ViewerMessageId.ViewerHoverChanged}',
      href: ((e.type === 'mouseover') ? link.href : ''),
    }, '*');
  }

  window.addEventListener('mouseout', onMouseInOut);
  window.addEventListener('mouseover', onMouseInOut);

  window.addEventListener('keydown', (e) => {
    window.parent.postMessage({
      type: '${ViewerMessageId.ViewerKeyDown}',
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
    }, '*');
  }, true);
</script>`;

