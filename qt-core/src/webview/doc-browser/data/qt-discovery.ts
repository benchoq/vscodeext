// Copyright (C) 2026 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as path from 'path';

import { QtAdditionalPath, CoreAPI, compareVersions } from 'qt-lib';
import { fsDir } from '@/fs-utils';
import { QtDocRootInfo } from '@/webview/shared/doc-browser';

export interface QtDocRootFindContext {
  purpose: 'doc-browser',
  coreApi?: CoreAPI,
  insRoot?: string,
  additionalQtpathsList?: QtAdditionalPath[],
};

export function findDocRoots(c: QtDocRootFindContext): QtDocRootInfo[] {
  const all: QtDocRootInfo[] = [];

  if (c.insRoot) {
    all.push(...findByInsRoot(c.insRoot));
  }

  if (c.coreApi && c.additionalQtpathsList) {
    const found = c.additionalQtpathsList
      .map((p: QtAdditionalPath) => (findByQtpathsExe(p.path, c.coreApi)))
      .filter((e) => (e !== undefined));

    all.push(...found);
  }

  return sortFilter(all, c);
}

function sortFilter(all: QtDocRootInfo[], c?: QtDocRootFindContext) {
  if (c?.purpose === 'doc-browser') {
    return all
      .filter((e) => e.version.startsWith('6.'))
      .sort((a, b) => {
        if (a.source !== b.source) {
          return a.source === 'insRoot' ? -1 : 1
        }

        return (-1 * compareVersions(a.version, b.version));
      })
  }

  return all;
}

function findByInsRoot(insRoot: string) {
  const docs = 'Docs';
  const names = fsDir(insRoot, docs).subDirNames();
  const prefixLength = 'Qt-'.length;

  return names.map((name) => ({
    source: 'insRoot',
    version: name.substring(prefixLength),
    fsPath: path.join(insRoot, docs, name),
  } as QtDocRootInfo));
}

function findByQtpathsExe(exePath: string, coreApi?: CoreAPI) {
  const info = coreApi?.getQtInfoFromPath(exePath).info;
  if (!info) {
    return undefined;
  }

  return {
    source: 'qtpaths',
    version: info.get('QT_VERSION') ?? '',
    fsPath: info.get('QT_INSTALL_DOCS')
  } as QtDocRootInfo;
}
// export interface QtPackageInfo {
//   source: 'insRoot' | 'qtpaths';
//   version: string;
//   insRootDir?: string;
//   qtpathsExe?: string;
//   qtpathsData?: QtPathsData;
// }

// export interface QtPackageFinder {
//   find(): QtPackageInfo[];
// }

// export interface EnumerationOptions {
//   qt6Only: boolean;
//   sortOrder: 'none' | 'asc' | 'desc';
// }

// export const DefaultEnumerationOptions: EnumerationOptions = {
//   qt6Only: true,
//   sortOrder: 'none'
// }

// export class QtPackage {
//   constructor(private readonly _info: QtPackageInfo) {
//   }

//   public get qtInstallDocs() {
//     if (this._info.source === 'insRoot') {
//       return path.join(this._info.insRootDir ?? '', 'Docs', this._info.version);
//     } else {
//       return this._info.qtpathsData?.get('QT_INSTALL_DOCS') ?? '';
//     }
//   }
// }

// export function enumQtPackages() {
//   const r = new QtPackageRegistry([
//     new InsRootDocsQtFinder(getCurrentGlobalQtInstallationRoot()),
//     ...getCurrentGlobalAdditionalQtPaths().map((p) => {
//       return new QtpathsQtFinder(p.path);
//     })
//   ]);

//   r.refresh();
//   return r.packages;
// }

// class InsRootDocsQtFinder implements QtPackageFinder {
//   constructor(private readonly _insRootDir: string) {}

//   public find(): QtPackageInfo[] {
//     const subDirsUnderDocs = fsDir(this._insRootDir, 'Docs').subDirNames();
//     const prefixLength = 'Qt-'.length;

//     return subDirsUnderDocs.map((dir) => ({
//       source: 'insRoot',
//       version: dir.substring(prefixLength),
//       insRootDir: this._insRootDir,
//     } as QtPackageInfo));
//   }
// }

// class QtpathsQtFinder implements QtPackageFinder {
//   constructor(private readonly _qtpathsExe: string) {}

//   public find(): QtPackageInfo[] {
//     const result = coreAPI?.getQtInfoFromPath(this._qtpathsExe);
//     const info = result?.info;

//     return [{
//       source: 'qtpaths',
//       version: info?.get('QT_VERSION') ?? '',
//       qtpathsExe: this._qtpathsExe,
//       qtpathsData: new Map(info?.data)
//     }];
//   }
// }

// class QtPackageRegistry {
//   private _packages: QtPackageInfo[] = [];

//   constructor(private readonly _finders: QtPackageFinder[]) {}

//   get packages() {
//     return this._packages.map((info) => new QtPackage(info));
//   }

//   public refresh(o = DefaultEnumerationOptions) {
//     let all = this._finders.flatMap((f) => (f.find()));

//     if (o.qt6Only) {
//       all = all.filter((p) => p.version.startsWith('6'))
//     }

//     if (o.sortOrder !== 'none') {
//       all = all.sort((a, b) => {
//         const dir = (o.sortOrder === 'asc' ? 1 : -1);
//         return (dir * compareVersions(a.version, b.version));
//       })
//     }

//     this._packages = all;
//   }
// }

// // 사용
// export interface QtPoolDir {
//   source: SourceType;
//   fsPath: string;
//   docsPath?: string;
//   examplesPath?: string;
//   qtVersion?: string;
//   qtPathsExe?: string;
//   qtPathsData?: QtPathsData;
// }

// export function enumerateQtPoolDirs(): QtPoolDir[] {
//   const found: QtPoolDir[] = [{
//     source: 'insRoot',
//     fsPath: getCurrentGlobalQtInstallationRoot()
//   }];

//   getCurrentGlobalAdditionalQtPaths().forEach((p) => {
//     const result = coreAPI?.getQtInfoFromPath(p.path);
//     if (result?.info) {
//       const docs = result.info.get('QT_INSTALL_DOCS'); // .../Qt/Docs/Qt-x.y.z
//       const examples = result.info.get('QT_INSTALL_EXAMPLES');
//       const version = result.info.get('QT_VERSION');
//       const parent = docs ? path.dirname(path.dirname(docs)) : '';

//       found.push({
//         source: 'qtpaths',
//         fsPath: parent,
//         ...(docs ? { docsPath: docs } : {}),
//         ...(examples ? { examplesPath: examples } : {}),
//         ...(version ? { qtVersion: version } : {}),
//         qtPathsData: new Map(result.info.data),
//         qtPathsExe: p.path
//       });
//     }
//   });

//   return found;
// }


// export interface QtPackage {
//   source: 'insRoot';
//   qtVersion: string;
//   insRootDir: string;

//   docsRootDir: string;
//   docsSubDir: string;
// }

// export interface QtPackage2 {
//   source: 'qtpaths';
//   qtVersion: string;
//   insRootDir: string;

//   qtpathsData: QtPathsData;
//   qtpathsExe: string;
// }

// export function readPackagesInfo(poolDir: QtPoolDir) {
//   if (poolDir.source === 'insRoot') {
//     const subDirsUnderDocs = fsDir(poolDir.fsPath, 'Docs').subDirNames();
//     const prefixLength = 'Qt-'.length;
//     const regexQt6 = new RegExp(`^Qt-6\\.\\d+\\.\\d+$`);

//     const all = subDirsUnderDocs
//       .filter((s) => regexQt6.test(s))
//       .sort((a, b) => {
//         return (
//           -1 *
//           compareVersions(a.substring(prefixLength), b.substring(prefixLength))
//         );
//       })
//       .map((dir) => ({
//         source: 'insRoot',
//         insRootDir: poolDir.fsPath,
//         docsRootDir: path.join(poolDir.fsPath, 'Docs'),
//         docsSubDir: dir,
//         qtVersion: dir.substring(prefixLength)
//       } as QtPackage));

//     return all;
//   }
//   else {
//     return [{
//       source: 'qtpaths',
//       qtVersion: poolDir.qtVersion ?? '',
//       qtpathsData: poolDir.qtPathsData,
//       qtpathsExe: poolDir.qtPathsExe
//     } as QtPackage2];
//   }

  // try {
  //   if (poolDir.docsPath) {
  //     const dir = fsDir(poolDir.docsPath);
  //     if (!dir.exists()) {
  //       return [];
  //     }
  //     const name = poolDir.qtVersion
  //       ? `Qt-${poolDir.qtVersion}`
  //       : path.basename(poolDir.docsPath);
  //     return [
  //       {
  //         name,
  //         subDir: name,
  //         poolDir
  //       }
  //     ];
  //   }

  //   const all = fsDir(poolDir.fsPath, consts.DOCS_DIR_NAME).subDirNames();
  //   const prefixLength = 'Qt-'.length;
  //   const regexQt6 = new RegExp(`^Qt-6\\.\\d+\\.\\d+$`);

  //   return all
  //     .filter((s) => regexQt6.test(s))
  //     .sort((a, b) => {
  //       return (
  //         -1 *
  //         compareVersions(a.substring(prefixLength), b.substring(prefixLength))
  //       );
  //     })
  //     .map((dir) => {
  //       return {
  //         name: dir,
  //         subDir: dir,
  //         poolDir
  //       } as ExPackage;
  //     });
  // } catch (_e) {
  //   return [];
  // }
// }
