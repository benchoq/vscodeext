## SYNTAX TEST "source.qml" "QML on-prop"

// Single-line QML objects break syntax highlighting of following code
// Task-number: VSCODEEXT-341

Item {
  anchors {
## <~~------- variable.parameter.attr-group-notation.qml
    left: parent.left
##  ^^^^ variable.parameter.attr-expr.qml
##        ^^^^^^ variable.other.object.js
##              ^	punctuation.accessor.js
##               ^^^^ variable.other.property.js
    }
}

Item {
  Behavior on x {
##^^^^^^^^ entity.name.type.on-prop.qml
    NumberAnimation { duration: 100 }
##  ^^^^^^^^^^^^^^^ entity.name.type.object.qml
##                    ^^^^^^^^ variable.parameter.attr-expr.qml
##                              ^^^ constant.numeric.decimal.js
  }
}

Item {
  Behavior on x {
##^^^^^^^^ entity.name.type.on-prop.qml
    NumberAnimation { duration: 100 }
##  ^^^^^^^^^^^^^^^ entity.name.type.object.qml
##                    ^^^^^^^^ variable.parameter.attr-expr.qml
##                              ^^^ constant.numeric.decimal.js
  }

  anchors {
## <~~------- variable.parameter.attr-group-notation.qml
    left: parent.left
##  ^^^^ variable.parameter.attr-expr.qml
##        ^^^^^^ variable.other.object.js
##              ^	punctuation.accessor.js
##               ^^^^ variable.other.property.js

  }
}
