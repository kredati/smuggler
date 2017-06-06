describe(`Smuggler's browser-facing side`, () => {

  it(`should load a library`, () => {
    expect(loadedLibrary).toBe(true)
  })

  it(`should export 'require'`, () => {
    expect(require).toBeDefined()
  })

  it(`should load a simple module`, () => {
    expect(require(`./app/test_module_2.js`)).toEqual({'bar': 'baz'})
  })

  it(`should load a nested module`, () => {
    expect(require(`./app/test_module.js`)).toEqual({'foo': {'bar': 'baz'}})
  })

  it(`should reject a request to load a module at a malformed path`, () => {
    let malformed = () => require('foo.js'),
      malformed2 = () => require('/foo.js'),
      malformed3 = () => require('abc')

      expect(malformed).toThrow()
      expect(malformed2).toThrow()
      expect(malformed3).toThrow()
  })

  it(`should not attempt to load a script above the application root`, () => {
    let beyond = () => require('../../../../foo.js')

    expect(beyond).toThrow()
  })

  it(`should fail to load a module that has not been loaded`, () => {
    let loadAbsent = () => require('./foo.js')

    expect(loadAbsent).toThrow(Error(
      `Module at ./foo.js has not been loaded. ` +
      `Check that there is a module at ./foo.js, ` +
      `for circular dependencies, and for proper loading ` +
      `order in smuggler config file.`))
  })

  it(`should not pollute the global scope`, () => {
    expect(window.modules).not.toBeDefined()
    expect(window.module).not.toBeDefined()
    expect(window.smuggler).not.toBeDefined()
  })

})
