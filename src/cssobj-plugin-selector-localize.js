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

    return dot + (name in localNames
                  ? localNames[name]
                  : prefix + name)
  }

  var mapSel = function(str, isClassList) {
    return str.replace(reClass, replacer)
  }

  var mapClass = function(str) {
    return mapSel((' '+str).replace(/\s+\.?/g, '.')).replace(/\./g, ' ')
  }

  return function localizeName (sel, node, result) {
    // don't touch at rule's selText
    // it's copied from parent, which already localized
    if(node.at) return sel
    if(!result.mapSel) result.mapSel = mapSel, result.mapClass = mapClass
    return mapSel(sel)
  }
}


