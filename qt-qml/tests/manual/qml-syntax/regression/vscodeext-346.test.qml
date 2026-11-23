## SYNTAX TEST "source.qml" "QML regression"

// Wrong or misspelled token scopes in QML highlighting
// Task-number: VSCODEEXT-346

pragma ListPropertyAssignBehavior: ReplaceIfNotDefault // Append, Replace,
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                               ^^ - entity.name.pragma.qml
//                                 ^^^^^^^^^^^^^^^^^^^ entity.name.pragma.qml
//                                                     ^^^^^^^^^^^^^^^^^^^ comment.line.qml
//

pragma ValueTypeBehavior: Addressable, Inaddressable, Copy
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                        ^^^^^^^^^^^ entity.name.pragma.qml
//                                     ^^^^^^^^^^^^^ entity.name.pragma.qml
//                                                    ^^^^ entity.name.pragma.qml
//

Item {
  property Item obj: Item {
##         ^^^^ storage.type.prop-custom.type.qml
## 	            ^^^ variable.parameter.attr-object.qml
##                   ^^^^ entity.name.type.object.qml
    width: 100
  }
}
