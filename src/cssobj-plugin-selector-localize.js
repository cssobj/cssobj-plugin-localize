// cssobj plugin

import {random} from '../../cssobj-helper/lib/cssobj-helper.js'

var reClass = /:global\s*\(((?:\s*\.[A-Za-z0-9_-]+\s*)+)\)|(\.)([!A-Za-z0-9_-]+)/g

export default function cssobj_plugin_selector_localize(prefix, localNames) {

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


