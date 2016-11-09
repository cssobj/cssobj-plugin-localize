define('cssobj_plugin_localize', function () { 'use strict';

// helper functions for cssobj

// check n is numeric, or string of numeric


function own(o, k) {
  return {}.hasOwnProperty.call(o, k)
}

// set default option (not deeply)


// convert js prop into css prop (dashified)


// capitalize str


// repeat str for num times


// don't use String.prototype.trim in cssobj, using below instead


// random string, should used across all cssobj plugins
var random = (function () {
  var count = 0;
  return function () {
    count++;
    return '_' + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
  }
})();

// extend obj from source, if it's no key in obj, create one


// ensure obj[k] as array, then push v into it
function arrayKV (obj, k, v, reverse, unique) {
  obj[k] = k in obj ? [].concat(obj[k]) : [];
  if(unique && obj[k].indexOf(v)>-1) return
  reverse ? obj[k].unshift(v) : obj[k].push(v);
}

// replace find in str, with rep function result


// get parents array from node (when it's passed the test)


// split selector etc. aware of css attributes


// checking for valid css value

// cssobj plugin

function cssobj_plugin_selector_localize(prefix, localNames) {

  prefix = prefix!=='' ? prefix || random() : '';

  localNames = localNames || {};

  var parser = function(str) {
    var store=[], ast=[], lastAst, name, match;
    for(var c, i=0, len=str.length; i<len; i++) {
      c=str[i];
      lastAst = ast[0];
      if(lastAst!=='\'' && lastAst!=='"') {
        // not in string
        if(c===':' && str.substr(i+1, 7)==='global(') {
          ast.unshift('g');
          i+=7;
          continue
        }
        if(~ '[(\'"'.indexOf(c)) ast.unshift(c);
        if(~ '])'.indexOf(c)) {
          if(c==')' && lastAst=='g') c='';
          ast.shift(c);
        }
        if(c==='.' && !lastAst) {
          if(str[i+1]=='!') {
            i++;
          } else {
            match = /[a-z0-9_-]+/i.exec(str.slice(i+1));
            if(match) {
              name = match[0];
              c += name in localNames
                ? localNames[name]
                : prefix + name;
              i += name.length;
            }
          }
        }
      } else {
        if(c===lastAst) ast.shift();
      }
      store.push(c);
    }
    return store.join('')
  };

  var mapSel = function(str) {
    return parser(str)
  };

  var mapClass = function(str) {
    return mapSel(str.replace(/\s+\.?/g, '.').replace(/^([^:\s.])/i, '.$1')).replace(/\./g, ' ')
  };

  return {
    selector: function localizeName (sel, node, result) {
      // don't touch at rule's selText
      // it's copied from parent, which already localized
      if(node.at) return sel
      if(!result.mapSel) result.mapSel = mapSel, result.mapClass = mapClass;
      return mapSel(sel)
    }
  }
}

return cssobj_plugin_selector_localize;

});
