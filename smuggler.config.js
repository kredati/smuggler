// SMUGGLER CONFIG

// Use this file to describe your application package
// Each field contains an array of strings that specify
// the path to included files.

smuggler.config = {

  // Libraries include code already packaged for browsers
  // Anything you would simply put in <script> tags

  // Smuggler will not import CDNs--
  // dynamic loading of foreign scripts will rightly
  // violate many browers' security policies.

  // Set library directory default; ends with a slash
  libraryPath: './lib/',

  // List libraries in loading order
  libraries: [
    'test_lib.js'
  ],

  // Modules are Node-style Common JS exports

  // Only what is bound to either module.exports or exports will be
  // available for `require` calls. Trying to load a module that does not bind
  // module.exports will throw an error.

  // Beware: scripts will still be loaded, and if you're not careful about
  // scope could have nasty side effects.

  // Modules must be listed in order of dependency: if script x `require`s
  // script y, y must PRECEDE x in this list.

  // Set module directory default; ends with a slash
  modulePath: './app/',

  // List modules in loading order
  modules: [
    'test_module_2.js',
    'test_module.js'
  ]
}
