// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import {
  workspace,
  ConfigurationTarget,
  WorkspaceConfiguration,
  ConfigurationChangeEvent
} from 'vscode';

export class SettingItem<T = unknown> {
  constructor(
    private readonly _section: string,
    private readonly _key: string,
  ) {}

  public affectedBy(e: ConfigurationChangeEvent) {
    return e.affectsConfiguration(`${this._section}.${this._key}`);
  }

  public get(): T | undefined;
  public get(defaultValue: T): T;
  public get(defaultValue?: T) {
    return this._config.get<T>(this._key, defaultValue as T);
  }

  public inspect() {
    return this._config.inspect<T>(this._key);
  }

  public update(
    value: T | undefined,
    target?: ConfigurationTarget | boolean | null,
    overrideInLanguage?: boolean,
  ): Thenable<void> {
    return this._config.update(this._key, value, target, overrideInLanguage);
  }

  private get _config(): WorkspaceConfiguration {
    return workspace.getConfiguration(this._section);
  }
}

type QtExtSettingSection =
  | 'qt-core'
  | 'qt-sm'
  | 'qt-qml'
  | 'qt-cpp'
  | 'qt-python'
  | 'qt-csharp'
;

export class QtExtSettingItem<T> extends SettingItem<T> {
  constructor(extSection: QtExtSettingSection, key: string) {
    super(extSection as string, key);
  }
}
