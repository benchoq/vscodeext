## SYNTAX TEST "source.qml" "QML signal"
// Copyright (C) 2024 The Qt Company Ltd.
## <-- comment.line.qml
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
## <-- comment.line.qml

import QtQuick
## <------ keyword.control.import.qml

Rectangle {
## <--------- entity.name.type.object.qml
    id: _rect
##  ^^ variable.parameter.attr-expr.qml

    // without parameters
##  ^^ comment.line.qml
    signal pressed
##  ^^^^^^ storage.type.signal.qml
##         ^^^^^^^ entity.name.function.signal.name.qml
    signal pressed()
##  ^^^^^^ storage.type.signal.qml
##         ^^^^^^^ entity.name.function.signal.name.qml
    signal pressed() // comment
##  ^^^^^^ storage.type.signal.qml
##         ^^^^^^^ entity.name.function.signal.name.qml
##                   ^^^^^^^^^^ comment.line.qml

    // signal with parameters
##  ^^ comment.line.qml
    signal clickedAt(x: real, y: real)
##  ^^^^^^ storage.type.signal.qml
##         ^^^^^^^^^ entity.name.function.signal.name.qml
##                   ^ variable.parameter.signal.param-name.qml
##                      ^^^^ entity.name.type.signal.param-type.qml
##                            ^ variable.parameter.signal.param-name.qml
##                               ^^^^ entity.name.type.signal.param-type.qml
    signal clickedAt(real x, real y) // old style
##  ^^^^^^ storage.type.signal.qml
##         ^^^^^^^^^ entity.name.function.signal.name.qml
##                   ^^^^ entity.name.type.signal.param-type.qml
##                        ^ variable.parameter.signal.param-name.qml
##                           ^^^^ entity.name.type.signal.param-type.qml
##                                ^ variable.parameter.signal.param-name.qml
##                                   ^^^^^^^^^^^^ comment.line.qml
}
