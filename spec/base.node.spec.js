console.log(`Testing Smuggler in node.`)

describe(`Smuggler's node-facing side`, () => {
  it(`Loads a single, basic module`, () => {
    let testModule = require(`../app/test_module_2.js`)

    expect(testModule).toEqual({bar: 'baz'})
  })

  it(`Loads a module that requires another module`, () => {
    let loadModule = () => require(`../app/test_module.js`)

    expect(loadModule).not.toThrow()

    let testModule = loadModule()

    expect(testModule).toEqual({foo: {bar: 'baz'}})
  })
})
