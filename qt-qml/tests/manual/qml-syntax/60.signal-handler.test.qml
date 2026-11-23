// SYNTAX TEST "source.qml" "QML signal-handler"

import QtQuick
// <------ keyword.control.import.qml

Rectangle {
// <--------- entity.name.type.object.qml
    id: _rect
//  ^^ storage.modifier.attr-id.qml

    // prop. changed signal handler
//  ^^ comment.line.qml
    onWidthChanged: _rect.pressed()
//  ^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
    onWidthChanged: {
//  ^^^^^^^^^^^^^^ variable.parameter.attr-block.qml
        console.log(`width changed to ${_rect.width}`)
//                   ^^^^^^^^^^^^^^^^ string.template.js
    }

    // item specific signal handler
//  ^^ comment.line.qml
    MouseArea {
//  ^^^^^^^^^ entity.name.type.object.qml
        onClicked: (mouse) => {
//      ^^^^^^^^^ variable.parameter.attr-expr.qml
            console.log("clicked")
//                      ^^^^^^^^^ string.quoted.double.js
            _rect.clickedAt(mouse.x, mouse.y)
        }
    }

    // attached signal handler
//  ^^ comment.line.qml
    Keys.onLeftPressed: console.log("move left")
//  ^^^^^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
//                                  ^^^^^^^^^^^ string.quoted.double.js

    Keys.onPressed: (event) => {
//  ^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
        if (event.key == Qt.Key_Left) {
//      ^^ keyword.control.conditional.js
            console.log("move left");
//                      ^^^^^^^^^^^ string.quoted.double.js
            event.accepted = true;
//                           ^^^^ constant.language.boolean.true.js
        }
    }

    Component.onCompleted: {
//  ^^^^^^^^^^^^^^^^^^^^^ variable.parameter.attr-block.qml
        console.log("onCompleted")
//                  ^^^^^^^^^^^^^ string.quoted.double.js
    }
}
