// cssobj plugin

import {random} from '../../cssobj-helper/lib/cssobj-helper.js'

export default function cssobj_plugin_selector_localize(prefix, localNames) {

  prefix = prefix!=='' ? prefix || random() : ''

  localNames = localNames || {}

  var parser = function(str) {
    var store=[], ast=[], lastAst, match
    for(var c, n, i=0, len=str.length; i<len; i++) {
      c=str[i]
      lastAst = ast[0]
      if(lastAst!=='\'' && lastAst!=='"') {
        // not in string
        if(!lastAst && c===':' && str.substr(i+1, 7)==='global(') {
          ast.unshift('g')
          i+=7
          continue
        }
        if(~ '[(\'"'.indexOf(c)) ast.unshift(c)
        if(~ '])'.indexOf(c)) {
          if(c==')' && lastAst=='g') c=''
          ast.shift(c)
        }
        if(!lastAst && c==='.') {
          i++
          if(str[i]!=='!') {
            match = []
            while( (n=str[i]) &&
                   (n>='0'&&n<='9'||n>='a'&&n<='z'||n>='A'&&n<='Z'||n=='-'||n=='_'||n>='\u00a0'))
              match.push(str[i++])
            if(match.length) {
              n = match.join('')
              c += n in localNames
                ? localNames[n]
                : prefix + n
            }
            i--
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


