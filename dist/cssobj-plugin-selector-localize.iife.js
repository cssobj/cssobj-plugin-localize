var cssobj_plugin_selector_localize = (function () {
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

      return dot + map(name)
    }

    var map = function(name) {
      return name in localNames ? localNames[name] : prefix + name
    }

    return function localizeName (sel, node, result) {
      if(!result.map) result.map = map
      return sel.replace(reClass, replacer)
    }
  }

  return cssobj_plugin_selector_localize;

}());