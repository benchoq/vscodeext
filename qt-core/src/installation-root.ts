// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {
  Home,
  IsUnix,
  IsWindows,
  QtInsRootConfigName,
  AdditionalQtPathsName,
  createLogger,
  isPathToQtPathsOrQMake,
  QtWorkspaceConfigMessage,
  QtAdditionalPath,
  IsMacOS
} from 'qt-lib';
import { EXTENSION_ID } from '@/constants';
import { coreAPI } from '@/extension';
import { convertAdditionalQtPaths } from '@/util';

const logger = createLogger('installation-root');

export async function setDoNotAskForDefaultQtInstallationRoot(value: boolean) {
  await vscode.workspace
    .getConfiguration(EXTENSION_ID)
    .update(
      'doNotAskForDefaultQtInstallationRoot',
      value,
      vscode.ConfigurationTarget.Global
    );
}

export function getCurrentGlobalQtInstallationRoot(): string {
  const qtInsRootConfig =
    getConfiguration().inspect<string>(QtInsRootConfigName);
  return qtInsRootConfig?.globalValue ?? '';
}

export function getCurrentGlobalAdditionalQtPaths(): QtAdditionalPath[] {
  const config = getConfiguration().inspect<(string | object)[]>(
    AdditionalQtPathsName
  );
  if (config?.globalValue) {
    return convertAdditionalQtPaths(config.globalValue);
  }

  return [];
}

function getConfiguration() {
  return vscode.workspace.getConfiguration(EXTENSION_ID);
}

function getDoNotAskForDefaultQtInstallationRoot(): boolean {
  return (
    vscode.workspace
      .getConfiguration(EXTENSION_ID)
      .get<boolean>('doNotAskForDefaultQtInstallationRoot') ?? false
  );
}

export function checkDefaultQtInsRootPath() {
  if (getDoNotAskForDefaultQtInstallationRoot()) {
    return;
  }

  if (getCurrentGlobalQtInstallationRoot()) {
    // Qt installation root is already set. No need to check for default path
    return;
  }

  if (!IsUnix && !IsWindows) {
    const errorMessage = 'Unsupported OS';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  const defaultQtInsRootName = 'Qt';
  const unixDefaultPaths = [
    path.join(Home, defaultQtInsRootName),
    path.join(Home, 'dev', defaultQtInsRootName),
    path.join('/', 'opt', defaultQtInsRootName)
  ];
  const winRoot =
    process.env.WINDIR !== undefined
      ? path.parse(process.env.WINDIR).root
      : 'C:';
  const winDefaultPaths = [
    path.join(winRoot, defaultQtInsRootName),
    path.join(winRoot, 'dev', defaultQtInsRootName)
  ];
  if (process.env.USERNAME) {
    winDefaultPaths.push(
      path.join(winRoot, 'Users', process.env.USERNAME, defaultQtInsRootName)
    );
  }
  if (process.env.USERPROFILE) {
    winDefaultPaths.push(
      path.join(process.env.USERPROFILE, defaultQtInsRootName)
    );
  }
  if (process.env.SYSTEMDRIVE) {
    winDefaultPaths.push(
      path.join(process.env.SYSTEMDRIVE, defaultQtInsRootName)
    );
  }
  if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
    winDefaultPaths.push(
      path.join(
        process.env.HOMEDRIVE,
        process.env.HOMEPATH,
        defaultQtInsRootName
      )
    );
  }
  if (IsMacOS) {
    unixDefaultPaths.push(path.join('/', 'Applications', defaultQtInsRootName));
    unixDefaultPaths.push(
      path.join(Home, 'Applications', defaultQtInsRootName)
    );
  }
  const defaultPaths = IsUnix ? unixDefaultPaths : winDefaultPaths;
  const foundDefaultPath = defaultPaths.find((defPath) =>
    fs.existsSync(defPath)
  );
  if (!foundDefaultPath) {
    return;
  }

  const setDefaultPathButtonMessage = 'Set Qt Installation Root';
  const doNotShowAgainButtonMessage = 'Do not show again';
  void vscode.window
    .showInformationMessage(
      `Qt installation root was found at "${foundDefaultPath}". Do you want to use it?`,
      setDefaultPathButtonMessage,
      doNotShowAgainButtonMessage
    )
    .then((response) => {
      if (response === setDefaultPathButtonMessage) {
        void setGlobalQtInstallationRoot(foundDefaultPath);
      } else if (response === doNotShowAgainButtonMessage) {
        void setDoNotAskForDefaultQtInstallationRoot(true);
      }
    });
}

export async function registerQt() {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    openLabel: 'Select Qt installation root',
    canSelectFiles: false,
    canSelectFolders: true
  };
  const selectedQtInsRootUri = await vscode.window.showOpenDialog(options);
  if (selectedQtInsRootUri?.[0] === undefined) {
    return;
  }
  const selectedQtInsRoot = selectedQtInsRootUri[0].fsPath;
  if (selectedQtInsRoot) {
    void setGlobalQtInstallationRoot(selectedQtInsRoot);
  }
  return 0;
}

async function setGlobalQtInstallationRoot(qtInsRoot: string) {
  logger.info(`Setting global Qt installation root to: ${qtInsRoot}`);
  const config = vscode.workspace.getConfiguration(EXTENSION_ID);
  await config.update(
    QtInsRootConfigName,
    qtInsRoot,
    vscode.ConfigurationTarget.Global
  );
}

export function onQtInsRootUpdated(
  newQtInstallationRoot: string,
  folder: vscode.WorkspaceFolder | string
) {
  if (newQtInstallationRoot) {
    if (!fs.existsSync(newQtInstallationRoot)) {
      logger.warn(`The specified Qt installation path does not exist.`);
      void vscode.window.showWarningMessage(
        `The specified Qt installation path does not exist.`
      );
    }
  }
  logger.info(`Qt installation root updated: "${newQtInstallationRoot}"`);

  const message = new QtWorkspaceConfigMessage(folder);
  message.config.set(QtInsRootConfigName, newQtInstallationRoot);
  coreAPI?.update(message);
}

export function onAdditionalQtPathsUpdated(
  newPaths: QtAdditionalPath[],
  folder: vscode.WorkspaceFolder | string
) {
  for (const p of newPaths) {
    if (!fs.existsSync(p.path)) {
      const msg = `The specified additional Qt installation '${p.path}' does not exist.`;
      logger.warn(msg);
      void vscode.window.showWarningMessage(msg);
    } else if (!isPathToQtPathsOrQMake(p.path)) {
      const msg = `The specified additional Qt installation '${p.path}' does not point to qtpaths nor qmake.`;
      logger.error(msg);
      void vscode.window.showWarningMessage(msg);
    }
  }
  logger.info('Additional Qt Paths updated: ' + JSON.stringify(newPaths));

  const message = new QtWorkspaceConfigMessage(folder);
  message.config.set(AdditionalQtPathsName, newPaths);
  coreAPI?.update(message);
}
