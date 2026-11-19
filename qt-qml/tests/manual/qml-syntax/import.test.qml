## SYNTAX TEST "source.qml" "sample testcase"

import QtQuick 2.0
## <- keyword.control.import.qml
##     ^ entity.name.section.import.module.qml
##             ^ constant.numeric.import.version.qml

import QtQuick.LocalStorage 2.0
## <- keyword.control.import.qml
##     ^ entity.name.section.import.module.qml
##                          ^ constant.numeric.import.version.qml

import QtQuick.LocalStorage 2.0 as Database
## <- keyword.control.import.qml
##     ^ entity.name.section.import.module.qml
##                          ^ constant.numeric.import.version.qml
##                              ^ keyword.control.import.as.qml
##                                 ^ entity.name.type.import.type.qml

import "../textwidgets"
## <- keyword.control.import.qml
##     ^ string.quoted.double.qml
