## SYNTAX TEST "source.qml" "QML regression"

// Binding continuation lines starting with a capitalized identifier are colored as type declarations
// Task-number: VSCODEEXT-343

Window {
  flags: Qt.Dialog |
##^^^^^ variable.parameter.attr-expr.qml
##       ^^ variable.other.object.js
##         ^ punctuation.accessor.js
##          ^^^^^^ variable.other.property.js
##                 ^ keyword.operator.bitwise.js
    Qt.WindowStaysOnTopHint
##  ^^ variable.other.object.js
##    ^ punctuation.accessor.js
##     ^^^^^^^^^^^^^^^^^^^^ variable.other.property.js
}
