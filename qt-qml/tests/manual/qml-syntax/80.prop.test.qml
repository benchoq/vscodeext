// SYNTAX TEST "source.qml" "QML prop"

import QtQuick
// <------ keyword.control.import.qml

// [default] [required] [readonly] property <propertyType> <propertyName>
// <-- comment.line.qml
// https://doc.qt.io/qt-6/qtqml-syntax-objectattributes.html
// <-- comment.line.qml

Window {
// <------ entity.name.type.object.qml
    // qml types
//  ^^ comment.line.qml
    property int height: 0
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^ storage.type.prop-custom.type.qml
//                       ^ constant.numeric.decimal.js
    property int height : 0
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^ storage.type.prop-custom.type.qml
//                        ^ constant.numeric.decimal.js
    property string name: "abcd"
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^^ storage.type.prop-custom.type.qml
//                        ^^^^^^ string.quoted.double.js
    property color color: "#121212" // comment
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml
//                        ^^^^^^^^^ string.quoted.double.js
//                                  ^^^^^^^^^^ comment.line.double-slash.js
    property point value: Qt.point(1, 2)
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml
//                                 ^ constant.numeric.decimal.js
//                                    ^ constant.numeric.decimal.js
    property list<int> value: [1, 2, 3, 4]
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^^^^^ storage.type.prop-custom.type.qml
//                     ^^^^^ variable.parameter.attr-list.qml
//                             ^ constant.numeric.decimal.js
//                                      ^ constant.numeric.decimal.js

    // default
//  ^^ comment.line.qml
    default property var someText
//  ^^^^^^^ storage.modifier.prop-custom.qml
//          ^^^^^^^^ keyword.other.prop-custom.qml
//                   ^^^ storage.type.prop-custom.type.qml
//                       ^^^^^^^^ variable.parameter.prop-custom.name.qml

    // required
//  ^^ comment.line.qml
    Component {
//  ^^^^^^^^^ entity.name.type.object.qml
        id: _delegate
//      ^^ variable.parameter.attr-expr.qml

        Item {
//      ^^^^ entity.name.type.object.qml
            required property int point
//          ^^^^^^^^ storage.modifier.prop-custom.qml
//                   ^^^^^^^^ keyword.other.prop-custom.qml
//                            ^^^ storage.type.prop-custom.type.qml
//                                ^^^^^ variable.parameter.prop-custom.name.qml
            required property string name
//          ^^^^^^^^ storage.modifier.prop-custom.qml
//                   ^^^^^^^^ keyword.other.prop-custom.qml
//                            ^^^^^^ storage.type.prop-custom.type.qml
//                                   ^^^^ variable.parameter.prop-custom.name.qml
            required property list<int> value
//          ^^^^^^^^ storage.modifier.prop-custom.qml
//                   ^^^^^^^^ keyword.other.prop-custom.qml
//                            ^^^^^^^^^ storage.type.prop-custom.type.qml
//                                      ^^^^^ variable.parameter.prop-custom.name.qml
        }
    }

    // readonly
//  ^^ comment.line.qml
    readonly property color myvalue: Qt.rgba(1, 1, 1, 1)
//  ^^^^^^^^ storage.modifier.prop-custom.qml
//           ^^^^^^^^ keyword.other.prop-custom.qml
//                    ^^^^^ storage.type.prop-custom.type.qml
//                                           ^ constant.numeric.decimal.js
    readonly property list<int> value: [1, 2, 3, 4]
//  ^^^^^^^^ storage.modifier.prop-custom.qml
//           ^^^^^^^^ keyword.other.prop-custom.qml
//                    ^^^^^^^^^ storage.type.prop-custom.type.qml
//                              ^^^^^ variable.parameter.attr-list.qml

    // alias
//  ^^ comment.line.qml
    property alias text: _text.text
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml

    // without initial value
//  ^^ comment.line.qml
    property color nextColor
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml
//                 ^^^^^^^^^ variable.parameter.prop-custom.name.qml
    property list<int> value
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^^^^^ storage.type.prop-custom.type.qml
//                     ^^^^^ variable.parameter.prop-custom.name.qml

    // props in child object
//  ^^ comment.line.qml
    Rectangle {
//  ^^^^^^^^^ entity.name.type.object.qml
        property int animatedHeight: 0
//      ^^^^^^^^ keyword.other.prop-custom.qml
//               ^^^ storage.type.prop-custom.type.qml
//                                   ^ constant.numeric.decimal.js
        property string name: "abcd"
//      ^^^^^^^^ keyword.other.prop-custom.qml
//               ^^^^^^ storage.type.prop-custom.type.qml
//                            ^^^^^^ string.quoted.double.js

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

        opacity: 1.0
//      ^^^^^^^ variable.parameter.attr-expr.qml
//               ^^^ constant.numeric.decimal.js

        Rectangle {
//      ^^^^^^^^^ entity.name.type.object.qml
            id: child
//          ^^ variable.parameter.attr-expr.qml
        }
    }

    // make property to a required one
//  ^^ comment.line.qml
    Rectangle {
//  ^^^^^^^^^ entity.name.type.object.qml
        required color
//      ^^^^^^^^ storage.modifier.prop-force-required.qml
//               ^^^^^ variable.parameter.prop-force-required.name.qml
    }

    // others
//  ^^ comment.line.qml
    property list<int> value: [
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^^^^^ storage.type.prop-custom.type.qml
//                     ^^^^^ variable.parameter.attr-list.qml
        1, 2, 3, 4
//      ^ constant.numeric.decimal.js
//         ^ constant.numeric.decimal.js
//            ^ constant.numeric.decimal.js
//               ^ constant.numeric.decimal.js
    ]

    property Model value1: Model { }
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml
//                 ^^^^^^ variable.parameter.attr-object.qml
//                         ^^^^^ entity.name.type.object.qml
    property Model value2: Model { }
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^^^ storage.type.prop-custom.type.qml
//                 ^^^^^^ variable.parameter.attr-object.qml
//                         ^^^^^ entity.name.type.object.qml
}
