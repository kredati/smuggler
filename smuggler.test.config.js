// SMUGGLER TESTING CONFIG

/* global smuggler */
smuggler.config = {

  scriptPath: './scripts/',
  scripts: [
    //'foo.js', // nonexistent script, should throw
    'test_script.js'
  ],

  modulePath: './',
  modules: [
    // 'app/test_module_4.js', // does not bind module.exports, should throw
    'test_module_3.js',
    // should load modules w/o .js // should not throw
    'modules/test_module_2',
    'modules/test_module.js'
  ]
}
