// SYNTAX TEST "source.qml" "QML import"

// --------------------------------------------------------------------
//  without version number
// --------------------------------------------------------------------
import QtQuick 2.0
// <------ keyword.control.import.qml
//     ^^^^^^^ entity.name.section.import.module.qml
//             ^^^ constant.numeric.import.version.qml
//
import QtQuick.LocalStorage 2.0
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^^^^^ entity.name.section.import.module.qml
//                          ^^^ constant.numeric.import.version.qml
//
import QtQuick.LocalStorage 2.0 as Database
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^^^^^ entity.name.section.import.module.qml
//                          ^^^ constant.numeric.import.version.qml
//                              ^^ keyword.control.import.as.qml
//                                 ^^^^^^^^ entity.name.type.import.type.qml

// --------------------------------------------------------------------
//  without version number
// --------------------------------------------------------------------
import QtQuick
// <------ keyword.control.import.qml
//     ^^^^^^^ entity.name.section.import.module.qml
//
import QtQuick.LocalStorage
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^^^^^ entity.name.section.import.module.qml
//
import QtQuick.LocalStorage as Database
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^^^^^ entity.name.section.import.module.qml
//                          ^^ keyword.control.import.as.qml
//                             ^^^^^^^^ entity.name.type.import.type.qml

// --------------------------------------------------------------------
// folders, files
// --------------------------------------------------------------------
import "../textwidgets"
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^ string.quoted.double.qml
//
import "../textwidgets" as MyModule
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^ string.quoted.double.qml
//                      ^^ keyword.control.import.as.qml
//                         ^^^^^^^^ entity.name.type.import.type.qml
//
import "somefile.js" as Script
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^ string.quoted.double.qml
//                   ^^ keyword.control.import.as.qml
//                      ^^^^^^ entity.name.type.import.type.qml

// --------------------------------------------------------------------
// others
// --------------------------------------------------------------------
import QtQuick 2.0 // comment
// <------ keyword.control.import.qml
//     ^^^^^^^ entity.name.section.import.module.qml
//             ^^^ constant.numeric.import.version.qml
//                 ^^^^^^^^^^ comment.line.qml
//
import QtQuick.LocalStorage 2.0 as Database // comment
// <------ keyword.control.import.qml
//     ^^^^^^^^^^^^^^^^^^^^ entity.name.section.import.module.qml
//                          ^^^ constant.numeric.import.version.qml
//                              ^^ keyword.control.import.as.qml
//                                 ^^^^^^^^ entity.name.type.import.type.qml
//                                          ^^^^^^^^^^ comment.line.qml
