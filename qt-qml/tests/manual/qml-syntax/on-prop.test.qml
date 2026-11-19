// SYNTAX TEST "source.qml" "QML on-prop"
// Copyright (C) 2024 The Qt Company Ltd.
// <-- comment.line.qml
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
// <-- comment.line.qml

import QtQuick
// <------ keyword.control.import.qml

// behavior
// <-- comment.line.qml
Rectangle {
// <--------- entity.name.type.object.qml
    width: 100; height: 100
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
//              ^^^^^^ variable.parameter.attr-expr.qml
//                      ^^^ constant.numeric.decimal.js

    Behavior on width {}
//  ^^^^^^^^ entity.name.type.on-prop.qml
//           ^^ keyword.control.on-prop.on.qml
//              ^^^^^ variable.parameter.on-prop.prop.qml
    Behavior on height {
//  ^^^^^^^^ entity.name.type.on-prop.qml
//           ^^ keyword.control.on-prop.on.qml
//              ^^^^^^ variable.parameter.on-prop.prop.qml
        NumberAnimation { duration: 1000 }
//      ^^^^^^^^^^^^^^^ entity.name.type.object.qml
//                        ^^^^^^^^ variable.parameter.attr-expr.qml
//                                  ^^^^ constant.numeric.decimal.js
    }
}

// custom behavior
// <-- comment.line.qml
Text {
// <---- entity.name.type.object.qml
    text: "aaa"
//  ^^^^ variable.parameter.attr-expr.qml
//        ^^^^^ string.quoted.double.js
    FadeBehavior on text {}
//  ^^^^^^^^^^^^ entity.name.type.on-prop.qml
//               ^^ keyword.control.on-prop.on.qml
//                  ^^^^ variable.parameter.on-prop.prop.qml
}

// animation on
// <-- comment.line.qml
ProgressBar {
// <----------- entity.name.type.object.qml
    from:0; to: 100; width: 200
//  ^^^^ variable.parameter.attr-expr.qml
//       ^ constant.numeric.decimal.js
//          ^^ variable.parameter.attr-expr.qml
//              ^^^ constant.numeric.decimal.js
//                   ^^^^^ variable.parameter.attr-expr.qml
//                          ^^^ constant.numeric.decimal.js

    NumberAnimation on value {
//  ^^^^^^^^^^^^^^^ entity.name.type.on-prop.qml
//                  ^^ keyword.control.on-prop.on.qml
//                     ^^^^^ variable.parameter.on-prop.prop.qml
        from: 0; to: 100
//      ^^^^ variable.parameter.attr-expr.qml
//            ^ constant.numeric.decimal.js
//               ^^ variable.parameter.attr-expr.qml
//                   ^^^ constant.numeric.decimal.js
        duration: 2000
//      ^^^^^^^^ variable.parameter.attr-expr.qml
//                ^^^^ constant.numeric.decimal.js
        loops: NumberAnimation.Infinite
//      ^^^^^ variable.parameter.attr-expr.qml
    }
}
