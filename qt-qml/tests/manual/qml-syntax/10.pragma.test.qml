// SYNTAX TEST "source.qml" "QML pragma"

pragma Singleton
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^ variable.parameter.pragma.qml
//
pragma ListPropertyAssignBehavior: ReplaceIfNotDefault // Append, Replace,
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                                 ^^^^^^^^^^^^^^^^^^^ entity.name.pragma.qml
//                                                     ^^^^^^^^^^^^^^^^^^^ comment.line.qml
//
pragma ComponentBehavior: Bound // Unbound
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                        ^^^^^ entity.name.pragma.qml
//                              ^^^^^^^^^^ comment.line.qml
//
pragma FunctionSignatureBehavior: Ignored // Enforced
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                                ^^^^^^^ entity.name.pragma.qml
//                                        ^^^^^^^^^^^ comment.line.qml
//
pragma NativeMethodBehavior: AcceptThisObject // RejectThisObject
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                           ^^^^^^^^^^^^^^^^ entity.name.pragma.qml
//                                            ^^^^^^^^^^^^^^^^^^^ comment.line.qml
//
pragma ValueTypeBehavior: Addressable // Inaddressable, Copy, Reference
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^^^^^^^^ variable.parameter.pragma.qml
//                        ^^^^^^^^^^^ entity.name.pragma.qml
//                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.line.qml
//
pragma Translator: myContext
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^ variable.parameter.pragma.qml
//                 ^^^^^^^^^ entity.name.pragma.qml
//
pragma Translator: "myContext"
// <------ keyword.control.pragma.qml
//     ^^^^^^^^^^ variable.parameter.pragma.qml
//                 ^^^^^^^^^^^ string.quoted.double.qml
