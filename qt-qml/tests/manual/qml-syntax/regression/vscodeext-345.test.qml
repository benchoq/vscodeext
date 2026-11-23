## SYNTAX TEST "source.qml" "QML regression"

// enum declarations are not highlighted
// Task-number: VSCODEEXT-345

Item {
  enum Direction {
##^^^^ keyword.other.enum.qml
##     ^^^^^^^^^ entity.name.type.enum.qml
    Up,
##  ^^ variable.other.enummember.qml
    Down = 4
##  ^^^^ variable.other.enummember.qml
##         ^ constant.numeric.decimal.js
  }
}
