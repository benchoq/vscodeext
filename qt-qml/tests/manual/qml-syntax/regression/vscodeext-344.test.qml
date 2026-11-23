## SYNTAX TEST "source.qml" "QML regression"

// Property declarations followed by a comment or semicolon lose all highlighting
// Task-number: VSCODEEXT-344

Item {
  property int works
##^^^^^^^^ keyword.other.prop-custom.qml
##         ^^^ storage.type.prop-custom.type.qml
##             ^^^^ variable.parameter.prop-custom.name.qml

  property int broken1 // any trailing comment
##^^^^^^^^ keyword.other.prop-custom.qml
##         ^^^ storage.type.prop-custom.type.qml
##             ^^^^^^^ variable.parameter.prop-custom.name.qml
##                     ^^^^^^^^^^^^^^^^^^^^^^^ comment.line.qml

  property int broken2;
##^^^^^^^^ keyword.other.prop-custom.qml
##         ^^^ storage.type.prop-custom.type.qml
##             ^^^^^^^ variable.parameter.prop-custom.name.qml
}
