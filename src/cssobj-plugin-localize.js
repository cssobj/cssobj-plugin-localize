// cssobj plugin

import {random} from '../../cssobj-helper/lib/cssobj-helper.js'

export default function cssobj_plugin_selector_localize(prefix, localNames) {

  prefix = prefix!=='' ? prefix || random() : ''

  localNames = localNames || {}

  var parser = function(str) {
    var store=[], ast=[], lastAst, name, match
    for(var c, i=0, len=str.length; i<len; i++) {
      c=str[i]
      lastAst = ast[0]
      if(lastAst!=='\'' && lastAst!=='"') {
        // not in string
        if(c===':' && str.substr(i+1, 7)==='global(') {
          ast.unshift('g')
          i+=7
          continue
        }
        if(~ '[(\'"'.indexOf(c)) ast.unshift(c)
        if(~ '])'.indexOf(c)) {
          if(c==')' && lastAst=='g') c=''
          ast.shift(c)
        }
        if(c==='.' && !lastAst) {
          if(str[i+1]=='!') {
            i++
          } else {
            match = /[a-z0-9_-]+/i.exec(str.slice(i+1))
            if(match) {
              name = match[0]
              c += name in localNames
                ? localNames[name]
                : prefix + name
              i += name.length
            }
          }
        }
      } else {
        if(c===lastAst) ast.shift()
      }
      store.push(c)
    }
    return store.join('')
  }

  var mapSel = function(str) {
    return parser(str)
  }

  var mapClass = function(str) {
    return mapSel(str.replace(/\s+\.?/g, '.').replace(/^([^:\s.])/i, '.$1')).replace(/\./g, ' ')
  }

  return {
    selector: function localizeName (sel, node, result) {
      // don't touch at rule's selText
      // it's copied from parent, which already localized
      if(node.at) return sel
      if(!result.mapSel) result.mapSel = mapSel, result.mapClass = mapClass
      return mapSel(sel)
    }
  }
}


