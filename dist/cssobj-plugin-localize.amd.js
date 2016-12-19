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


// random string, should used across all cssobj plugins
var random = (function () {
  var count = 0;
  return function (prefix) {
    count++;
    return '_' + (prefix||'') + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
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


// split char aware of syntax
function syntaxSplit (str, splitter, keepSplitter, test, final) {
  var isString, isFeature, isSplitter, feature = [], segment = [], result = [], ast = [], len = str.length;
  for (var c, i = 0, lastAst, prev = 0; i <= len; i++) {
    c = str.charAt(i);
    lastAst = ast[0];
    isString = lastAst == '\'' || lastAst == '"';
    if (!isString) {
      if ('[(\'"'.indexOf(c) >= 0) ast.unshift(c);
      if ('])'.indexOf(c) >= 0) ast.shift();
    } else {
      if (c == lastAst) ast.shift();
    }
    if (lastAst) {
      segment.push(c);
    } else {
      isFeature = test && c && test(c, i, segment, result);
      isSplitter = c == splitter || !c;
      if (isSplitter && !keepSplitter) c = '';
      if (isFeature) feature.push(c);
      if (!isFeature || isSplitter) segment.push(feature.length ? final(feature.join('')) : '', c), feature = [];
      if (isSplitter) result.push(segment.join('')), segment = [];
    }
  }
  return result
}

// checking for valid css value

// cssobj plugin

function isClassName (char, i, segment) {
  return i>0 && !segment.length && (char == '!'
          || char >= '0' && char <= '9'
          || char >= 'a' && char <= 'z'
          || char >= 'A' && char <= 'Z'
          || char == '-'
          || char == '_'
          || char >= '\u00a0')
}

function cssobj_plugin_selector_localize(option) {

  option = option || {};

  var space = option.space = typeof option.space!=='string'
      ? (typeof option.random == 'function' ?  option.random() : random())
      : option.space;

  var localNames = option.localNames = option.localNames || {};

  var localize = function(name) {
    return name[0]=='!'
      ? name.slice(1)
      : (name in localNames
         ? localNames[name]
         : name + space)
  };

  var parseSel = function(str) {
    return syntaxSplit(
      str,
      '.',
      true,
      isClassName,
      localize
    ).join('')
  };

  var mapClass = function(str) {
    return parseSel(str.replace(/\s+\.?/g, '.').replace(/^([^:\s.])/i, '.$1')).replace(/\./g, ' ')
  };

  return {
    selector: function localizeName (sel, node, result) {
      // don't touch at rule's selText
      // it's copied from parent, which already localized
      if(node.at) return sel
      if(!result.mapSel) {
        result.space = space;
        result.localNames = localNames;
        result.mapSel = parseSel;
        result.mapClass = mapClass;
      }

      return parseSel(sel)
    }
  }
}

return cssobj_plugin_selector_localize;

});
