module.exports = (() => {

  let bar = require('./test_module_2.js')
  let bay = require('../test_module_3.js')

  return {foo: bar}

})()
