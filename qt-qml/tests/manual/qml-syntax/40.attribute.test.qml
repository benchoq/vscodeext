// SYNTAX TEST "source.qml" "QML attribute forms"

Rectangle {
// <--------- entity.name.type.object.qml
    // object case
//  ^^^^^^^^^^^^^^ comment.line.qml
    gradient: Gradient {
//  ^^^^^^^^ variable.parameter.attr-object.qml
//            ^^^^^^^^ entity.name.type.object.qml
        GradientStop { position: 0.0; color: "yellow" }
//      ^^^^^^^^^^^^ entity.name.type.object.qml
//                     ^^^^^^^^ variable.parameter.attr-expr.qml
//                               ^^^ constant.numeric.decimal.js
//                                    ^^^^^ variable.parameter.attr-expr.qml
//                                           ^^^^^^^^ string.quoted.double.js
        GradientStop { position: 1.0; color: "green" }
//      ^^^^^^^^^^^^ entity.name.type.object.qml
//                     ^^^^^^^^ variable.parameter.attr-expr.qml
//                               ^^^ constant.numeric.decimal.js
//                                    ^^^^^ variable.parameter.attr-expr.qml
//                                           ^^^^^^^ string.quoted.double.js
    }

    // list of objects
//  ^^^^^^^^^^^^^^^^^^ comment.line.qml
    children: [
//  ^^^^^^^^ variable.parameter.attr-list.qml
        Item { value: 1 },
//      ^^^^ entity.name.type.object.qml
//             ^^^^^ variable.parameter.attr-expr.qml
//                    ^ constant.numeric.decimal.js
        Item { value: 2 },
//      ^^^^ entity.name.type.object.qml
//             ^^^^^ variable.parameter.attr-expr.qml
//                    ^ constant.numeric.decimal.js
        T.Item { value: 3 }
//      ^^^^^^ entity.name.type.object.qml
//               ^^^^^ variable.parameter.attr-expr.qml
//                      ^ constant.numeric.decimal.js
    ]

    // list of js expressions
//  ^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.qml
    values: [
//  ^^^^^^ variable.parameter.attr-list.qml
        1, 2, 3, 4,
//      ^ constant.numeric.decimal.js
//         ^ constant.numeric.decimal.js
//            ^ constant.numeric.decimal.js
//               ^ constant.numeric.decimal.js
        2*20, Math.PI, calc(20)
//      ^ constant.numeric.decimal.js
//        ^^ constant.numeric.decimal.js
    ]

    // js block
//  ^^^^^^^^^^^ comment.line.qml
    width: { return 100; }
//  ^^^^^ variable.parameter.attr-block.qml
//           ^^^^^^ keyword.control.flow.js
//                  ^^^ constant.numeric.decimal.js
    width: {
//  ^^^^^ variable.parameter.attr-block.qml
        const val = 3;
//      ^^^^^ storage.type.js
//                  ^ constant.numeric.decimal.js
        const result = val * 2;
//      ^^^^^ storage.type.js
//                           ^ constant.numeric.decimal.js

        // comment
//      ^^^^^^^^^^ comment.line.double-slash.js
        return result / Math.PI;
//      ^^^^^^ keyword.control.flow.js
    }

    // js expression
//  ^^^^^^^^^^^^^^^^ comment.line.qml
    width: 100 * 2;
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
//               ^ constant.numeric.decimal.js
    width: height / 2
//  ^^^^^ variable.parameter.attr-expr.qml
//                  ^ constant.numeric.decimal.js
    width: 100
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
    width: 100;
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
    width: 100; height: 200
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
//              ^^^^^^ variable.parameter.attr-expr.qml
//                      ^^^ constant.numeric.decimal.js
    width: 100; height: 200;
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
//              ^^^^^^ variable.parameter.attr-expr.qml
//                      ^^^ constant.numeric.decimal.js
    color: "red"
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^^^ string.quoted.double.js
    color: Qt.rgba(100, 100, 100, 100)
//  ^^^^^ variable.parameter.attr-expr.qml
    opacity: 1.2
//  ^^^^^^^ variable.parameter.attr-expr.qml
//           ^^^ constant.numeric.decimal.js
    visible: true
//  ^^^^^^^ variable.parameter.attr-expr.qml
//           ^^^^ constant.language.boolean.true.js
    visible: false
//  ^^^^^^^ variable.parameter.attr-expr.qml
//           ^^^^^ constant.language.boolean.false.js
    values: [1, 2, 3, 4]
//  ^^^^^^ variable.parameter.attr-list.qml
//           ^ constant.numeric.decimal.js
//                    ^ constant.numeric.decimal.js

    // group
//  ^^^^^^^^ comment.line.qml
    anchors.fill: parent
//  ^^^^^^^^^^^^ variable.parameter.attr-expr.qml
    anchors {
//  ^^^^^^^ variable.parameter.attr-group-notation.qml
        left: other.right // comment
//      ^^^^ variable.parameter.attr-expr.qml
//                        ^^^^^^^^^^ comment.line.double-slash.js
        right: parent.right
//      ^^^^^ variable.parameter.attr-expr.qml
        // comment
//      ^^^^^^^^^^ comment.line.qml
        top: parent.top
//      ^^^ variable.parameter.attr-expr.qml
    }

    // multi-line
//  ^^^^^^^^^^^^^ comment.line.qml
    color: Qt.rgba(
//  ^^^^^ variable.parameter.attr-expr.qml
        100,
//      ^^^ constant.numeric.decimal.js
        100,
//      ^^^ constant.numeric.decimal.js
        100,
//      ^^^ constant.numeric.decimal.js
        Math.random()
    )
}
