// SMUGGLER TESTING CONFIG

/* global smuggler */
smuggler.config = {

  scriptPath: './lib/',
  scripts: [
    //'foo_lib.js', // nonexistent library, should throw
    'test_lib.js'
  ],

  modulePath: './',
  modules: [
    // 'app/test_module_4.js', // does not bind module.exports, should throw
    'test_module_3.js',
    'app/test_module_2.js',
    'app/test_module.js'
  ]
}
