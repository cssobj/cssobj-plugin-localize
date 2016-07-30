var expect = require('chai').expect
var lib = require('../dist/cssobj-plugin-selector-localize.cjs.js')

describe('Test plugin selector localize', function() {


  it('should localize with random prefix', function() {

    var loc = lib()

    var ret = loc('body .nav .item', {}, {})
    expect(ret).match(/body ._\w{5,7}\d_nav ._\w{5,7}\d_item/)

    var ret = loc('body.nav.item', {}, {})
    expect(ret).match(/body._\w{5,7}\d_nav._\w{5,7}\d_item/)

    var ret = loc('body.nav.item div', {}, {})
    expect(ret).match(/body._\w{5,7}\d_nav._\w{5,7}\d_item div/)

    var ret = loc('body   .nav.item', {}, {})
    expect(ret).match(/body   ._\w{5,7}\d_nav._\w{5,7}\d_item/)

  })

  it('should localize with localNames', function() {

    var loc = lib(null, {nav: '_custom_nav'})
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body ._custom_nav ._\w+\d_item/)

    expect(result.mapSel('.nav')).equal('._custom_nav')

    expect(result.mapSel('.item')).match(/\._\w+\d_item/)
    expect(result.mapSel('.item .nav')).match(/_\w+\d_item \._custom_nav/)

  })

  it('should localize with custom prefix', function() {

    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body .nav .item', {}, result)

    expect(ret).match(/body ._prefix_nav ._prefix_item/)

    expect(result.mapSel('.nav')).equal('._prefix_nav')

    expect(result.mapSel('.item')).equal('._prefix_item')

  })

  it('should localize with custom prefix and localNames', function() {

    var loc = lib('_prefix_', {nav: '_custom_nav'})
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body ._custom_nav ._prefix_item/)

    expect(result.mapSel('.nav.item')).equal('._custom_nav._prefix_item')

  })

  it('should also add prefix when not in sel', function() {

    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body ._prefix_nav ._prefix_item/)


    // will return localized event there's not in string
    expect(result.mapSel('.xyz')).equal('._prefix_xyz')

    expect(result.mapSel('.nav.xyz')).equal('._prefix_nav._prefix_xyz')

  })

  it('should no prefix when prefix=""', function() {

    var loc = lib('')
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body .nav .item/)

    expect(result.mapSel('.xyz')).equal('.xyz')

  })

  it('should work right with complex selector', function() {

    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('@support (prefix=(.abc)), [xyz=.abc], url=(.abc)', {}, result)
    expect(ret).equal('@support (prefix=(._prefix_abc)), [xyz=._prefix_abc], url=(._prefix_abc)')

  })

  it('should work right with :global', function() {
    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body :global(.nav .item)', {}, result)
    expect(ret).equal('body .nav .item')

    var ret = loc('body:global(.nav .item)', {}, result)
    expect(ret).equal('body.nav .item')

    var ret = loc('body:global( .nav .item).xyz', {}, result)
    expect(ret).equal('body .nav .item._prefix_xyz')

    expect(result.mapSel('body .nav :global(.xyz)')).equal('body ._prefix_nav .xyz')

  })

  it('should work right with ! symbol', function() {
    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body.!nav .!item .xyz', {}, result)
    expect(ret).equal('body.nav .item ._prefix_xyz')

    expect(result.mapSel('.nav.!item')).equal('._prefix_nav.item')
  })

  it('should work right with ! symbol and localNames', function() {
    var loc = lib('_prefix_', {xyz: 'abc', item:'cde'})
    var result = {}

    var ret = loc('body.!nav .!item .xyz', {}, result)
    expect(ret).equal('body.nav .item .abc')
    expect(result.mapSel('.item.!xyz')).equal('.cde.xyz')

  })

  it('should work right with repeated class', function() {
    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body .nav .nav.nav', {}, result)
    expect(ret).equal('body ._prefix_nav ._prefix_nav._prefix_nav')

  })

  it('should return class list with mapClass', function() {

    var loc = lib('_prefix_')
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).equal('body ._prefix_nav ._prefix_item')

    expect(result.mapClass('item nav')).equal(' _prefix_item _prefix_nav')

    // also accept with .class
    expect(result.mapClass('.item.nav')).equal(' _prefix_item _prefix_nav')
    expect(result.mapClass('.item .nav')).equal(' _prefix_item _prefix_nav')
    expect(result.mapClass(' .item .nav')).equal(' _prefix_item _prefix_nav')

    // multiple space in end will into 1
    expect(result.mapClass('  item   nav     ')).equal(' _prefix_item _prefix_nav ')
    // with ! escape
    expect(result.mapClass('  item   !nav     ')).equal(' _prefix_item nav ')
    expect(result.mapClass('  item')).equal(' _prefix_item')
    expect(result.mapClass('item')).equal(' _prefix_item')
    expect(result.mapClass('item ')).equal(' _prefix_item ')

    // global will generate 2 space, have to with .class
    expect(result.mapClass(':global(.item.nav) abc')).equal('  item nav _prefix_abc')

  })

})
