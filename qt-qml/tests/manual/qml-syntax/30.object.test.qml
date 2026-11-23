// SYNTAX TEST "source.qml" "QML object"

Window {
// <------ entity.name.type.object.qml
    id: mywindow
//  ^^ storage.modifier.attr-id.qml
    width: 640
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
    height : 480
//  ^^^^^^ variable.parameter.attr-expr.qml
//           ^^^ constant.numeric.decimal.js

// --------------------------------------------------------------------
//  child: single line
// --------------------------------------------------------------------
    Rectangle { width: 100; height: 100 }
//  ^^^^^^^^^ entity.name.type.object.qml
//              ^^^^^ variable.parameter.attr-expr.qml
//                     ^^^ constant.numeric.decimal.js
//                          ^^^^^^ variable.parameter.attr-expr.qml
//                                  ^^^ constant.numeric.decimal.js

// --------------------------------------------------------------------
//  child: multiple lines
// --------------------------------------------------------------------
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

// --------------------------------------------------------------------
//  child: nesting
// --------------------------------------------------------------------
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

// --------------------------------------------------------------------
//  child: object as property value
// --------------------------------------------------------------------
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

// --------------------------------------------------------------------
//  child: object with namespace
// --------------------------------------------------------------------
    MyModule.Text {
//  ^^^^^^^^^^^^^ entity.name.type.object.qml
        text: "Hello!"
//      ^^^^ variable.parameter.attr-expr.qml
//            ^^^^^^^^ string.quoted.double.js
    }
}
