// SYNTAX TEST "source.qml" "QML method"
// Copyright (C) 2024 The Qt Company Ltd.
// <-- comment.line.qml
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
// <-- comment.line.qml

import QtQuick
// <------ keyword.control.import.qml

Item {
// <---- entity.name.type.object.qml
    function myfunc() { return 3; } // comment
//  ^^^^^^^^ storage.type.function.js
//           ^^^^^^ entity.name.function.js
//                      ^^^^^^ keyword.control.flow.js
//                             ^ constant.numeric.decimal.js
//                                  ^^^^^^^^^^ comment.line.qml
    function myfunc() { // comment
//  ^^^^^^^^ storage.type.function.js
//           ^^^^^^ entity.name.function.js
//                      ^^^^^^^^^^ comment.line.double-slash.js
        // comment
//      ^^^^^^^^^^ comment.line.double-slash.js
        return 3;
//      ^^^^^^ keyword.control.flow.js
//             ^ constant.numeric.decimal.js
    }

    function myfunc(): int {
//  ^^^^^^^^ storage.type.function.js
//           ^^^^^^ entity.name.function.js
        return 3;
//      ^^^^^^ keyword.control.flow.js
//             ^ constant.numeric.decimal.js
    }

    function myfunc(): int {
//  ^^^^^^^^ storage.type.function.js
//           ^^^^^^ entity.name.function.js
        return 3;
//      ^^^^^^ keyword.control.flow.js
//             ^ constant.numeric.decimal.js
    }

    function myfunc(a: int, b: date, c: Item): int {
//  ^^^^^^^^ storage.type.function.js
//           ^^^^^^ entity.name.function.js
        return a + b + c.prop;
//      ^^^^^^ keyword.control.flow.js
    }

    // arrow function
//  ^^ comment.line.qml
    Component.onCompleted: () => {
//  ^^^^^^^^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
        console.log("aaa");
//                  ^^^^^ string.quoted.double.js
    }

    Keys.onPressed: (event)=> {
//  ^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
        if (event.key == Qt.Key_Left) {
//      ^^ keyword.control.conditional.js
            console.log("move left");
//                      ^^^^^^^^^^^ string.quoted.double.js
            event.accepted = true;
//                           ^^^^ constant.language.boolean.true.js
        }
    }

    // inside child item
//  ^^ comment.line.qml
    MouseArea {
//  ^^^^^^^^^ entity.name.type.object.qml
        function insideItem(a: int, b: date): int {
//      ^^^^^^^^ storage.type.function.js
//               ^^^^^^^^^^ entity.name.function.js
            return a + b;
//          ^^^^^^ keyword.control.flow.js
        }

        // arrow function
//      ^^ comment.line.qml
        onClicked: (e) => {
//      ^^^^^^^^^ variable.parameter.attr-expr.qml
            console.log("clicked", e);
//                      ^^^^^^^^^ string.quoted.double.js
            insideItem(a, b)
        }

        // without (), {}
//      ^^ comment.line.qml
        onPressed: mouse => root.activated(mouse.x, mouse.y)
//      ^^^^^^^^^ variable.parameter.attr-expr.qml
    }
}
