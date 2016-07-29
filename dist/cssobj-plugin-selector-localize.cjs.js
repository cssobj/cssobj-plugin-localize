'use strict';

// random string, should used across all cssobj plugins
var random = (function () {
  var count = 0
  return function () {
    count++
    return '_' + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
  }
})()

var reClass = /:global\s*\(((?:\s*\.[A-Za-z0-9_-]+\s*)+)\)|(\.)([!A-Za-z0-9_-]+)/g

function cssobj_plugin_selector_localize(prefix, localNames) {

  prefix = prefix!=='' ? prefix || random() : ''

  localNames = localNames || {}

  var replacer = function (match, global, dot, name) {
    if (global) {
      return global
    }
    if (name[0] === '!') {
      return dot + name.substr(1)
    }

    return dot + (name in localNames
                  ? localNames[name]
                  : prefix + name)
  }

  var map = function(str, isClassList) {
    return str.replace(reClass, replacer)
  }

  var map2 = function(str) {
    return map((' '+str).replace(/\s+\.?/g, '.')).replace(/\./g, ' ')
  }

  return function localizeName (sel, node, result) {
    // don't touch at rule's selText
    // it's copied from parent, which already localized
    if(node.at) return sel
    if(!result.map) result.map = map, result.map2 = map2
    return map(sel)
  }
}

module.exports = cssobj_plugin_selector_localize;