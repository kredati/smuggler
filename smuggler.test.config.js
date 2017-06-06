// SMUGGLER TESTING CONFIG

smuggler.config = {

  libraryPath: './lib/',
  libraries: [
    // 'foo_lib.js', // nonexistent library, should throw
    'test_lib.js'
  ],

  modulePath: './',
  modules: [
    //'app/test_module_4.js', // does not bind module.exports, should throw
    'test_module_3.js',
    'app/test_module_2.js',
    'app/test_module.js'
  ]
}
