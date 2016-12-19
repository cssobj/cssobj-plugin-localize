// cssobj plugin

import {random, syntaxSplit} from '../../cssobj-helper/lib/cssobj-helper.js'

function isClassName (char, i, segment) {
  return i>0 && !segment.length && (char == '!'
          || char >= '0' && char <= '9'
          || char >= 'a' && char <= 'z'
          || char >= 'A' && char <= 'Z'
          || char == '-'
          || char == '_'
          || char >= '\u00a0')
}

export default function cssobj_plugin_selector_localize(option) {

  option = option || {}

  var space = option.space = typeof option.space!=='string'
      ? (typeof option.random == 'function' ?  option.random() : random())
      : option.space

  var localNames = option.localNames = option.localNames || {}

  var localize = function(name) {
    return name[0]=='!'
      ? name.slice(1)
      : (name in localNames
         ? localNames[name]
         : name + space)
  }

  var parseSel = function(str) {
    return syntaxSplit(
      str,
      '.',
      true,
      isClassName,
      localize
    ).join('')
  }

  var mapClass = function(str) {
    return parseSel(str.replace(/\s+\.?/g, '.').replace(/^([^:\s.])/i, '.$1')).replace(/\./g, ' ')
  }

  return {
    selector: function localizeName (sel, node, result) {
      // don't touch at rule's selText
      // it's copied from parent, which already localized
      if(node.at) return sel
      if(!result.mapSel) {
        result.space = space
        result.localNames = localNames
        result.mapSel = parseSel
        result.mapClass = mapClass
      }

      return parseSel(sel)
    }
  }
}


