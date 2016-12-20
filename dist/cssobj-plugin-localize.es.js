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


// split selector with comma, aware of css attributes


// split selector with splitter, aware of css attributes
function splitSelector (sel, splitter) {
  if (sel.indexOf(splitter) < 0) return [sel]
  for (var c, i = 0, n = 0, instr = '', prev = 0, d = []; c = sel.charAt(i); i++) {
    if (instr) {
      if (c == instr) instr = '';
      continue
    }
    if (c == '"' || c == '\'') instr = c;
    if (c == '(' || c == '[') n++;
    if (c == ')' || c == ']') n--;
    if (!n && c == splitter) d.push(sel.substring(prev, i)), prev = i + 1;
  }
  return d.concat(sel.substring(prev))
}

// split char aware of syntax


// checking for valid css value

// cssobj plugin

var classNameRe = /[ \~\\@$%^&\*\(\)\+\=,/';\:"?><[\]\\{}|`]/;

function cssobj_plugin_selector_localize(option) {

  option = option || {};

  var space = option.space = typeof option.space!=='string'
      ? (typeof option.random == 'function' ?  option.random() : random())
      : option.space;

  var localNames = option.localNames = option.localNames || {};

  var localize = function(name) {
    return name[0]=='!'
      ? name.substr(1)
      : (name in localNames
         ? localNames[name]
         : name + space)
  };

  var parseSel = function(str) {
    var part = splitSelector(str, '.');
    var sel=part[0];
    for(var i = 1, p, pos, len = part.length; i < len; i++) {
      p = part[i];
      if(!p) {
        sel += '.';
        continue
      }
      pos = p.search(classNameRe);
      sel += '.' + (pos<0 ? localize(p) : localize(p.substr(0,pos)) + p.substr(pos));
    }
    return sel
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

export default cssobj_plugin_selector_localize;
