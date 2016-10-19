# cssobj-plugin-localize

[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj) [![Build Status](https://travis-ci.org/cssobj/cssobj-plugin-localize.svg?branch=master)](https://travis-ci.org/cssobj/cssobj-plugin-localize)

Localize class names for cssobj.

## Install

install from github directly:

``` javascript
npm install cssobj/cssobj-plugin-localize
```

## API

``` javascript
var localize = require('cssobj-plugin-localize')
var loc = localize(prefix, localNames)
```

#### *PARAMS*

#### prefix

- Type: `String`

- Default: Random String

If pass empty string `''`, will use `''` (empty prefix)

If pass other falsy value, will use default.

#### localNames

- Type: `Object`

- Default: `{}`

**key/val** pair to define how class name map into local name.

Key is original class name.

Val is localized name.

#### *RETURN*

#### Add method to `result`

The cssobj `result` object will be added 2 method by this plugin:

##### - `result.mapSel({string} selector){ return {string} mappedSelector }`

Replace class names in `selector` string, with all class names replace by localized version. (**keep dot** <kbd>.</kbd>)

##### - `result.mapClass({string} classList){ return {string} mappedClassList }`

Treat `classList` string as space seperated class list(e.g. in `<div class="abc efg">`),

Replace all seperated word by localized version. (**without dot**)

The classList can be `'nav item'`, or `'.nav .item'` form, all <kbd>.</kbd> will be replaced by space.

##### Above 2 method both can accept `:global(.class1 .class2)` and `.!class1 .!class2` escaped for global space.

## Usage

#### - Localize

``` javascript
var localize = require('cssobj-plugin-localize')
var ret = cssobj({'.item': {color: 'red'}}, {
  plugins:[  localize() ]
})
// css is => ._1hisnf23_item {color: red;}

// you can get the mapped selector using:
ret.mapSel('.nav .item')  // === ._1hisnf23_nav ._1hisnf23_item

// you can get the mapped class list using:
// (used in className attributes for HTML tag)
ret.mapClass('.nav .item')  // === _1hisnf23_nav _1hisnf23_item
ret.mapClass('nav item')  // === _1hisnf23_nav _1hisnf23_item

```

#### - Global

There's 2 way to make class **Global**

##### 1. :global(classNames)

Add **:global()** to wrap class names, to make them global.

``` javascript
var ret = cssobj({'body :global(.nav .item) .login': {color: 'red'}}, {
  plugins:[  localize() ]
})
// css is => body .nav .item ._1hisnf23_login {color: red;}
```

##### 2. .!className

Just add **!** in front of class name, if you want it global.

``` javascript
var ret = cssobj({'body .!nav .!item .login': {color: 'red'}}, {
  plugins:[  localize() ]
})
// css is => body .nav .item ._1hisnf23_login {color: red;}
```

#### - Custom Prefix

You can control the prefix:

``` javascript
var ret = cssobj({'body .nav .item .login': {color: 'red'}}, {
  plugins:[  localize('_your_prefix_') ]
})
// css is => body ._your_prefix_nav ._your_prefix_item ._your_prefix_login {color: red;}
```


#### - Custom Local Names

You can control the map for each class name:

``` javascript
var ret = cssobj({'body .nav .!item .login': {color: 'red'}}, {
  plugins:[  localize(null, {nav: '_abc_'}) ]
})
// css is => body ._abc_ .!item ._1hisnf23_login {color: red;}
```

#### - Get the class map

``` javascript
var ret = cssobj({'body .nav .item .login': {color: 'red'}}, {
  plugins:[  localize('_prefix_', {nav: '_abc_'}) ]
})

ret.mapSel('.nav .item .!pushRight')  // === ._abc_ ._prefix_item .pushRight
ret.mapSel(':global(.nav .item) .pushRight')  // === .nav .item ._prefix_pushRight
ret.mapClass('item nav !pushRight')  // ===  _prefix_item _abc_ pushRight
```

