## SYNTAX TEST "source.qml" "QML types"

Rectangle {
## <--------- entity.name.type.object.qml

  width: 300
## <~~----- variable.parameter.attr-expr.qml
##       ^^^ constant.numeric.decimal.js

  visible: true
##         ^^^^ constant.language.boolean.true.js

  color: "skyblue"
##       ^^^^^^^^^ string.quoted.double.js

  gradient: Gradient {
## <~~-------- variable.parameter.attr-object.qml
##          ^^^^^^^^ entity.name.type.object.qml
      GradientStop { position: 0.0; color: "yellow" }
##    ^^^^^^^^^^^^ entity.name.type.object.qml
##                   ^^^^^^^^ variable.parameter.attr-expr.qml
##                             ^^^ constant.numeric.decimal.js
  }
}
