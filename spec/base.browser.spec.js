/* global require */
/* eslint global-require: "off" */
describe(`Smuggler's browser-facing side`, () => {

  it(`should load a script`, () => {
    expect(window.scriptLoaded).toBe(true)
  })

  it(`should export 'require'`, () => {
    expect(require).toBeDefined()
  })

  it(`should load a simple module`, () => {
    expect(require(`./modules/test_module_2.js`)).toEqual({bar: 'baz'})
  })

  it(`should load a nested module`, () => {
    expect(require(`./modules/test_module.js`)).toEqual({foo: {bar: 'baz'}})
  })

  it(`should load modules with or without specifying a .js extension`, () => {
    let test1 = require(`./modules/test_module`),
      test2 = require(`./modules/test_module.js`)

    expect(test1).toEqual(test2)
  })

  it(`should reject a request to load a module at a malformed path`, () => {
    let malformed = () => require('foo.js'),
      malformed2 = () => require('/foo.js'),
      malformed3 = () => require('abc'),
      malformed4 = () => require(4)

      // these errors include stack traces and are variable
      expect(malformed).toThrow()
      expect(malformed2).toThrow()
      expect(malformed3).toThrow()

      // this error is static
      expect(malformed4).toThrow(Error(
        `Paths passed to require must be strings. 4 is a(n) number`))
  })

  it(`should not attempt to load a script above the application root`, () => {
    let beyond = () => require('../../foo.js')

    // this error includes stack traces and is variable
    expect(beyond).toThrow()
  })

  it(`should fail to load a module that has not been loaded`, () => {
    let loadAbsent = () => require('./foo.js')

    expect(loadAbsent).toThrow(Error(
      `Tried to require module at ./foo.js ` +
      `that has not been loaded. Check that there is a module at ./foo.js, ` +
      `for circular dependencies, and for proper module loading ` +
      `order in Smuggler config file`))
  })

  it(`should not pollute the global scope`, () => {
    expect(window.modules).not.toBeDefined()
    expect(window.module).not.toBeDefined()
    expect(window.smuggler).not.toBeDefined()
  })

})
