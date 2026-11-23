## SYNTAX TEST "source.qml" "QML regression"

// Multi-line property bindings lose highlighting on continuation lines
// Task-number: VSCODEEXT-342

Item {
  width: parent.width > 100
##^^^^^ variable.parameter.attr-expr.qml
##       ^^^^^^ variable.other.object.js
##             ^ punctuation.accessor.js
##              ^^^^^ variable.other.property.js
##                    ^ keyword.operator.relational.js
##                      ^^^ constant.numeric.decimal.js
    ? parent.width
##  ^ keyword.operator.ternary.js
##    ^^^^^^ variable.other.object.js
##          ^ punctuation.accessor.js
##           ^^^^^ variable.other.property.js
    : Math.min(100, parent.height)
##  ^ keyword.operator.ternary.js
##    ^^^^^^^^ meta.function-call.js
##             ^^^ constant.numeric.decimal.js
##                  ^^^^^^ variable.other.object.js
##                        ^ punctuation.accessor.js
##                         ^^^^^^ variable.other.property.js

  height: implicitHeight +
##^^^^^^ variable.parameter.attr-expr.qml
##        ^^^^^^^^^^^^^^ variable.other.readwrite.js
##                       ^ keyword.operator.arithmetic.js
    20
##  ^^ constant.numeric.decimal.js

  opacity: enabled ? 1.0
##^^^^^^^ variable.parameter.attr-expr.qml
##         ^^^^^^^ variable.other.readwrite.js
##                 ^ keyword.operator.ternary.js
##                   ^^^ constant.numeric.decimal.js
                   : 0.3
##                 ^ keyword.operator.ternary.js
##                   ^^^ constant.numeric.decimal.js
}

