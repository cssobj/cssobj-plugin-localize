# cssobj-plugin-selector-localize

[![Build Status](https://travis-ci.org/cssobj/cssobj-plugin-selector-localize.svg?branch=master)](https://travis-ci.org/cssobj/cssobj-plugin-selector-localize)

Localize class names for cssobj.

## Install

install from github directly:

``` javascript
npm install cssobj/cssobj-plugin-selector-localize
```

## API

``` javascript
var localize = require('cssobj-plugin-selector-localize')
var loc = localize(prefix, localNames)
```

#### - prefix

- Type: `String`

- Default: Random String

If pass empty string `''`, will use `''` (empty prefix)

If pass other falsy value, will use default.

#### - localNames

- Type: `Object`

- Default: `{}`

**key/val** pair to define how class name map into local name.

Key is original class name.

Val is localized name.

## Usage

#### - Localize

``` javascript
var localize = require('cssobj-plugin-selector-localize')
var ret = cssobj({'.item': {color: 'red'}}, {
  plugins:{ selector: localize() }
})
// css is => ._1hisnf23_item {color: red;}

// you can get the map using:
ret.map('item')  // === _1hisnf23_item

```

#### - Global

There's 2 way to make class **Global**

##### 1. :global(classNames)

Add **:global()** to wrap class names, to make them global.

``` javascript
var ret = cssobj({'body :global(.nav .item) .login': {color: 'red'}}, {
  plugins:{ selector: localize() }
})
// css is => body .nav .item ._1hisnf23_login {color: red;}
```

##### 2. .!className

Just add **!** in front of class name, if you want it global.

``` javascript
var ret = cssobj({'body .!nav .!item .login': {color: 'red'}}, {
  plugins:{ selector: localize() }
})
// css is => body .nav .item ._1hisnf23_login {color: red;}
```

#### - Custom Prefix

You can control the prefix:

``` javascript
var ret = cssobj({'body .nav .item .login': {color: 'red'}}, {
  plugins:{ selector: localize('_your_prefix_') }
})
// css is => body ._your_prefix_nav ._your_prefix_item ._your_prefix_login {color: red;}
```


#### - Custom Local Names

You can control the map for each class name:

``` javascript
var ret = cssobj({'body .nav .!item .login': {color: 'red'}}, {
  plugins:{ selector: localize(null, {nav: '_abc_'}) }
})
// css is => body ._abc_ .!item ._1hisnf23_login {color: red;}
```

#### - Get the class map

``` javascript
var ret = cssobj({'body .nav .item .login': {color: 'red'}}, {
  plugins:{ selector: localize('_prefix_', {nav: '_abc_'}) }
})

ret.map('nav')  // === _abc_
ret.map('item')  // === _prefix_item
```

