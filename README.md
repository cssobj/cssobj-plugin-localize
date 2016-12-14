# cssobj-plugin-localize

[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj) [![Build Status](https://travis-ci.org/cssobj/cssobj-plugin-localize.svg?branch=master)](https://travis-ci.org/cssobj/cssobj-plugin-localize)

Localize class names for cssobj. Put CSS Class names into different name **space**.

## Install

install from github directly:

``` javascript
npm install cssobj/cssobj-plugin-localize
```

## API

### localize(space: boolean|string, localNames: object) -> {selector: function}

#### space

- Type: `String` | `Boolean`

- Default: Random String

If pass empty string `''`, will use `''` (empty space)

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

You can control the space:

``` javascript
var ret = cssobj({'body .nav .item .login': {color: 'red'}}, {
  plugins:[  localize('_your_space_') ]
})
// css is => body ._your_space_nav ._your_space_item ._your_space_login {color: red;}
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
  plugins:[  localize('_space_', {nav: '_abc_'}) ]
})

ret.mapSel('.nav .item .!pushRight')  // === ._abc_ ._space_item .pushRight
ret.mapSel(':global(.nav .item) .pushRight')  // === .nav .item ._space_pushRight
ret.mapClass('item nav !pushRight')  // ===  _space_item _abc_ pushRight
```

