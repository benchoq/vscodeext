// SYNTAX TEST "source.qml" "QML object"
// Copyright (C) 2024 The Qt Company Ltd.
// <-- comment.line.qml
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
// <-- comment.line.qml

import QtQuick as MyModule
// <------ keyword.control.import.qml
//     ^^^^^^^ entity.name.section.import.module.qml
//             ^^ keyword.control.import.as.qml
//                ^^^^^^^^ entity.name.type.import.type.qml

Window {
// <------ entity.name.type.object.qml
    width: 640
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
    height : 480
//  ^^^^^^ variable.parameter.attr-expr.qml
//           ^^^ constant.numeric.decimal.js

     // single line
//   ^^^^^^^^^^^^^^ comment.line.qml
    Rectangle { width: 100; height: 100 }
//  ^^^^^^^^^ entity.name.type.object.qml
//              ^^^^^ variable.parameter.attr-expr.qml
//                     ^^^ constant.numeric.decimal.js
//                          ^^^^^^ variable.parameter.attr-expr.qml
//                                  ^^^ constant.numeric.decimal.js

    // multiple lines
//  ^^ comment.line.qml
    Rectangle {
//  ^^^^^^^^^ entity.name.type.object.qml
        width: 100
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^ constant.numeric.decimal.js
        height: 100
//      ^^^^^^ variable.parameter.attr-expr.qml
//              ^^^ constant.numeric.decimal.js
    }

    Rectangle
//  ^^^^^^^^^ entity.name.type.object.qml
    {
        width: 100
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^ constant.numeric.decimal.js
        height: 100
//      ^^^^^^ variable.parameter.attr-expr.qml
//              ^^^ constant.numeric.decimal.js
    }

    // nesting
//  ^^ comment.line.qml
    Rectangle {
//  ^^^^^^^^^ entity.name.type.object.qml
        width: 100
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^ constant.numeric.decimal.js
        height: 100
//      ^^^^^^ variable.parameter.attr-expr.qml
//              ^^^ constant.numeric.decimal.js

        Text {
//      ^^^^ entity.name.type.object.qml
            width: 100
//          ^^^^^ variable.parameter.attr-expr.qml
//                 ^^^ constant.numeric.decimal.js
            height: 100
//          ^^^^^^ variable.parameter.attr-expr.qml
//                  ^^^ constant.numeric.decimal.js
        }
    }

    // object as prop. value
//  ^^ comment.line.qml
    Rectangle {
//  ^^^^^^^^^ entity.name.type.object.qml
        width: 100
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^ constant.numeric.decimal.js
        height: 100
//      ^^^^^^ variable.parameter.attr-expr.qml
//              ^^^ constant.numeric.decimal.js
        gradient: Gradient {
//      ^^^^^^^^ variable.parameter.attr-object.qml
//                ^^^^^^^^ entity.name.type.object.qml
            GradientStop { position: 0.0; color: "yellow" }
//          ^^^^^^^^^^^^ entity.name.type.object.qml
//                         ^^^^^^^^ variable.parameter.attr-expr.qml
//                                   ^^^ constant.numeric.decimal.js
//                                        ^^^^^ variable.parameter.attr-expr.qml
//                                               ^^^^^^^^ string.quoted.double.js
            GradientStop { position: 1.0; color: "green" }
//          ^^^^^^^^^^^^ entity.name.type.object.qml
//                         ^^^^^^^^ variable.parameter.attr-expr.qml
//                                   ^^^ constant.numeric.decimal.js
//                                        ^^^^^ variable.parameter.attr-expr.qml
//                                               ^^^^^^^ string.quoted.double.js
        }
    }

    // object within namespace
//  ^^ comment.line.qml
    MyModule.Text {
//  ^^^^^^^^^^^^^ entity.name.type.object.qml
        text: "Hello from my custom text item!"
//      ^^^^ variable.parameter.attr-expr.qml
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ string.quoted.double.js
    }
}
