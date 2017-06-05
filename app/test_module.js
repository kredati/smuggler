module.exports = (() => {

  let bar = require('./app/test_module_2.js')

  return {foo: bar}

})()
