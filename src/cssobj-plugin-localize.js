// cssobj plugin

import {random, splitSelector, isString} from '../../cssobj-helper/lib/cssobj-helper.js'

var classNameRe = /[ \~\\@$%^&\*\(\)\+\=,/';\:"?><[\]\\{}|`]/

export default function cssobj_plugin_selector_localize(option) {

  option = option || {}

  var space = option.space = typeof option.space!=='string'
      ? (typeof option.random == 'function' ?  option.random() : random())
      : option.space

  var localNames = option.localNames = option.localNames || {}

  var localize = function(name) {
    return name[0]=='!'
      ? name.substr(1)
      : (name in localNames
         ? localNames[name]
         : name + space)
  }

  var parseSel = function(str) {
    if(!isString(str)) return str
    var part = splitSelector(str, '.')
    var sel=part[0]
    for(var i = 1, p, pos, len = part.length; i < len; i++) {
      p = part[i]
      if(!p) {
        sel += '.'
        continue
      }
      pos = p.search(classNameRe)
      sel += '.' + (pos<0 ? localize(p) : localize(p.substr(0,pos)) + p.substr(pos))
    }
    return sel
  }

  var mapClass = function(str) {
    return isString(str)
      ? parseSel(str.replace(/\s+\.?/g, '.').replace(/^([^:\s.])/i, '.$1')).replace(/\./g, ' ')
      : str
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


