## SYNTAX TEST "source.qml" "QML regression"

// enum declarations are not highlighted
// Task-number: VSCODEEXT-346

Item {
  property Item obj: Item {
##         ^^^^ storage.type.prop-custom.type.qml
## 	            ^^^ variable.parameter.attr-object.qml
##                   ^^^^ entity.name.type.object.qml
    width: 100
  }
}
