var expect = require('chai').expect
var lib = require('../dist/cssobj-plugin-localize.cjs.js')

describe('Test plugin selector localize', function() {


  it('should localize with random space', function() {

    var loc = lib().selector

    var ret = loc('body .nav .item', {}, {})
    expect(ret).match(/body .nav_\w{5,7}\d_ .item_\w{5,7}\d_/)

    var ret = loc('body.nav.item', {}, {})
    expect(ret).match(/body.nav_\w{5,7}\d_.item_\w{5,7}\d_/)

    var ret = loc('body.nav.item div', {}, {})
    expect(ret).match(/body.nav_\w{5,7}\d_.item_\w{5,7}\d_ div/)

    var ret = loc('body   .nav.item', {}, {})
    expect(ret).match(/body   .nav_\w{5,7}\d_.item_\w{5,7}\d_/)

  })

  it('should localize with localNames', function() {

    var loc = lib({space: null, localNames: {nav: '_custom_nav'}}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body ._custom_nav .item_\w+\d_/)

    expect(result.mapSel('.nav')).equal('._custom_nav')

    expect(result.mapSel('.item')).match(/\.item_\w+\d_/)
    expect(result.mapSel('.item .nav')).match(/item_\w+\d_ \._custom_nav/)

  })

  it('should localize with custom space', function() {

    var loc = lib({space: '_space_'}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)

    expect(ret).match(/body .nav_space_ .item_space_/)

    expect(result.mapSel('.nav')).equal('.nav_space_')
    expect(result.mapSel('.nav a[href=abc.html]')).equal('.nav_space_ a[href=abc.html]')

    expect(result.mapSel('.item')).equal('.item_space_')

  })

  it('should localize with custom space and localNames', function() {

    var loc = lib({space: '_space_', localNames: {nav: '_custom_nav'}}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body ._custom_nav .item_space_/)

    expect(result.mapSel('.nav.item')).equal('._custom_nav.item_space_')

  })

  it('should also add space when not in sel', function() {

    var loc = lib({space:'_james_'}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body .nav_james_ .item_james_/)


    // will return localized event there's not in string
    expect(result.mapSel('.xyz')).equal('.xyz_james_')

    expect(result.mapSel('.nav.xyz')).equal('.nav_james_.xyz_james_')

  })

  it('should no space when space=""', function() {

    var loc = lib({space:''}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).match(/body .nav .item/)

    expect(result.mapSel('.xyz')).equal('.xyz')

  })

  it('should work right with complex selector', function() {

    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('@support (prefix=(.abc)), [xyz=.abc], url=(.abc)', {}, result)

    /* since 2.1.0 below will not supported */
    // expect(ret).equal('@support (prefix=(._space_abc)), [xyz=._space_abc], url=(._space_abc)')
    expect(ret).equal('@support (prefix=(.abc)), [xyz=.abc], url=(.abc)')

  })

  it('should work right with :global', function() {
    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('body :global(.nav .item)', {}, result)
    expect(ret).equal('body .nav .item')

    var ret = loc(':global(.nav .item)', {}, result)
    expect(ret).equal('.nav .item')

    var ret = loc('body:global(.nav .item)', {}, result)
    expect(ret).equal('body.nav .item')

    var ret = loc('body:global( .nav .item).xyz', {}, result)
    expect(ret).equal('body .nav .item.xyz_space_')

    expect(result.mapSel('body .nav :global(.xyz)')).equal('body .nav_space_ .xyz')

  })

  it('should work right with ! symbol', function() {
    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('body.!nav .!item .xyz', {}, result)
    expect(ret).equal('body.nav .item .xyz_space_')

    expect(result.mapSel('.nav.!item')).equal('.nav_space_.item')
  })

  it('should work right with unicode selector', function() {
    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('.选择器1 .选择器2 .!选择器3', {}, result)
    expect(ret).equal('.选择器1_space_ .选择器2_space_ .选择器3')
  })

  it('should work right with string and bracket', function() {
    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('.nav a[title=".sdf].abc:global(.def)"]', {}, result)
    expect(ret).equal('.nav_space_ a[title=".sdf].abc:global(.def)"]')

    expect(result.mapSel('.item[.!xyz.abc:global(.def)]')).equal('.item_space_[.!xyz.abc:global(.def)]')
  })

  it('should work right with ! symbol and localNames', function() {
    var loc = lib({space:'_space_', localNames: {xyz: 'abc', item:'cde'}}).selector
    var result = {}

    var ret = loc('body.!nav .!item .xyz', {}, result)
    expect(ret).equal('body.nav .item .abc')
    expect(result.mapSel('.item.!xyz')).equal('.cde.xyz')

  })

  it('should work right with repeated class', function() {
    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('body .nav .nav.nav', {}, result)
    expect(ret).equal('body .nav_space_ .nav_space_.nav_space_')

  })

  it('should return class list with mapClass', function() {

    var loc = lib({space:'_space_'}).selector
    var result = {}

    var ret = loc('body .nav .item', {}, result)
    expect(ret).equal('body .nav_space_ .item_space_')

    expect(result.mapClass('item nav')).equal(' item_space_ nav_space_')

    // also accept with .class
    expect(result.mapClass('.item.nav')).equal(' item_space_ nav_space_')
    expect(result.mapClass('.item .nav')).equal(' item_space_ nav_space_')
    expect(result.mapClass(' .item .nav')).equal(' item_space_ nav_space_')

    // multiple space in end will into 1
    expect(result.mapClass('  item   nav     ')).equal(' item_space_ nav_space_ ')
    // with ! escape
    expect(result.mapClass('  item   !nav     ')).equal(' item_space_ nav ')
    expect(result.mapClass('  item')).equal(' item_space_')
    expect(result.mapClass('item')).equal(' item_space_')
    expect(result.mapClass('item ')).equal(' item_space_ ')

    // global will generate 2 space, have to with .class
    expect(result.mapClass(':global(.item.nav) abc')).equal(' item nav abc_space_')

  })

})
