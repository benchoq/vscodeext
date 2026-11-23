// SYNTAX TEST "source.qml" "QML others"

// enum
// <-- comment.line.qml
Text {
// <---- entity.name.type.object.qml
    enum TextType {
//  ^^^^ keyword.other.enum.qml
//       ^^^^^^^^ entity.name.type.enum.qml
        Normal,
//      ^^^^^^ variable.other.enummember.qml
        Heading = 20,
//      ^^^^^^^ variable.other.enummember.qml
//              ^ keyword.operator.assignment.qml
//                ^^ constant.numeric.decimal.js
        Contents
//      ^^^^^^^^ variable.other.enummember.qml
    }

    property int textType: MyText.TextType.Normal
//  ^^^^^^^^ keyword.other.prop-custom.qml
//           ^^^ storage.type.prop-custom.type.qml

    font.bold: textType === MyText.TextType.Heading
//  ^^^^^^^^^ variable.parameter.attr-expr.qml
    font.pixelSize: textType === MyText.TextType.Heading ? 24 : 12
//  ^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
//                                                         ^^ constant.numeric.decimal.js
//                                                              ^^ constant.numeric.decimal.js
}

// inline component
// <-- comment.line.qml
Window {
// <------ entity.name.type.object.qml
    width: 300
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^ constant.numeric.decimal.js
    height: 200
//  ^^^^^^ variable.parameter.attr-expr.qml
//          ^^^ constant.numeric.decimal.js
    visible: true
//  ^^^^^^^ variable.parameter.attr-expr.qml
//           ^^^^ constant.language.boolean.true.js

    PushButtonInline { x: 50; y: 20 }
//  ^^^^^^^^^^^^^^^^ entity.name.type.object.qml
//                     ^ variable.parameter.attr-expr.qml
//                        ^^ constant.numeric.decimal.js
//                            ^ variable.parameter.attr-expr.qml
//                               ^^ constant.numeric.decimal.js
    PushButtonInline { x: 50; y: 100 }
//  ^^^^^^^^^^^^^^^^ entity.name.type.object.qml
//                     ^ variable.parameter.attr-expr.qml
//                        ^^ constant.numeric.decimal.js
//                            ^ variable.parameter.attr-expr.qml
//                               ^^^ constant.numeric.decimal.js

    component PushButtonInline: Rectangle {
//  ^^^^^^^^^ keyword.other.comp-inline.qml
//            ^^^^^^^^^^^^^^^^ entity.name.type.comp-line.name.qml
//                              ^^^^^^^^^ entity.name.type.object.qml
        id: _rect
//      ^^ storage.modifier.attr-id.qml
        color: "skyblue"
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^^^^^^^ string.quoted.double.js
        border.color: "lightgray"
//      ^^^^^^^^^^^^ variable.parameter.attr-expr.qml
//                    ^^^^^^^^^^^ string.quoted.double.js
        implicitWidth: 150
//      ^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
//                     ^^^ constant.numeric.decimal.js
        implicitHeight: 60
//      ^^^^^^^^^^^^^^ variable.parameter.attr-expr.qml
//                      ^^ constant.numeric.decimal.js
    }
}

// attached prop
// <-- comment.line.qml
ListView {
// <-------- entity.name.type.object.qml
    delegate: Item {
//  ^^^^^^^^ variable.parameter.attr-object.qml
//            ^^^^ entity.name.type.object.qml
        id: _delegate
//      ^^ storage.modifier.attr-id.qml
        width: 100; height: 30
//      ^^^^^ variable.parameter.attr-expr.qml
//             ^^^ constant.numeric.decimal.js
//                  ^^^^^^ variable.parameter.attr-expr.qml
//                          ^^ constant.numeric.decimal.js

        Rectangle {
//      ^^^^^^^^^ entity.name.type.object.qml
            width: 100; height: 30
//          ^^^^^ variable.parameter.attr-expr.qml
//                 ^^^ constant.numeric.decimal.js
//                      ^^^^^^ variable.parameter.attr-expr.qml
//                              ^^ constant.numeric.decimal.js
            color: _delegate.ListView.isCurrentItem ? "red" : "yellow" // correct
//          ^^^^^ variable.parameter.attr-expr.qml
//                                                    ^^^^^ string.quoted.double.js
//                                                            ^^^^^^^^ string.quoted.double.js
//                                                                     ^^^^^^^^^^ comment.line.double-slash.js
        }
    }
}

// string
// <-- comment.line.qml
Item {
// <---- entity.name.type.object.qml
    prop1: "value1"
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^^^^^^ string.quoted.double.js
    prop2: 'value2'
//  ^^^^^ variable.parameter.attr-expr.qml
//         ^^^^^^^^ string.quoted.single.js
    prop3: `${prop1} abcd` + `this is a ${prop2} value.`
//  ^^^^^ variable.parameter.attr-expr.qml
//                   ^^^^ string.template.js
//                            ^^^^^^^^^ string.template.js

    Component.onCompleted: {
//  ^^^^^^^^^^^^^^^^^^^^^ variable.parameter.attr-block.qml
        // single line
//      ^^^^^^^^^^^^^^ comment.line.double-slash.js
        console.log("string text line ");
//                  ^^^^^^^^^^^^^^^^^^^ string.quoted.double.js
        console.log('string text line ');
//                  ^^^^^^^^^^^^^^^^^^^ string.quoted.single.js
        console.log(`string text line with ${a+b} and ${prop1}.`);
//                   ^^^^^^^^^^^^^^^^^^^^^ string.template.js
//                                                ^^^ string.template.js

        // multiple line
//      ^^^^^^^^^^^^^^^^ comment.line.double-slash.js
        console.log(`string text line with ${a+b} and ${prop1}.
//                   ^^^^^^^^^^^^^^^^^^^^^ string.template.js
            the second line`);
//          ^^^^^^^^^^^^^^^ string.template.js
    }
}

// comment
// <-- comment.line.qml
// This is a line comment
// <-- comment.line.qml

Item { // This is a comment
// <---- entity.name.type.object.qml
//     ^^^^^^^^^^^^^^^^^^^^ comment.line.qml
}

/*
// <-- comment.block.qml
  This is a block comment
//^^^^^^^^^^^^^^^^^^^^^^^ comment.block.qml
*/
// <-- comment.block.qml

/*!
// <--- comment.block.qml
  This is a block comment
//^^^^^^^^^^^^^^^^^^^^^^^ comment.block.qml
*/
// <-- comment.block.qml

// some helpers for user convenience
// <-- comment.line.qml
Item {
// <---- entity.name.type.object.qml
  // NOTE note entry
//   ^^^^ constant.language.qml
  // TODO todo entry
//   ^^^^ constant.language.qml
  // DEBUG debug entry
//   ^^^^^ constant.language.qml
  // XXX xxx entry
//   ^^^ constant.language.qml
  // BUG bug entry
//   ^^^ invalid
  // FIXME fixme entry
//   ^^^^^ invalid
  // WARNING warning entry
//   ^^^^^^^ invalid
}
