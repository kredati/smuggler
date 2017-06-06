// SMUGGLER CONFIG

// Use this file to describe your application package
// This file loads "libraries" and "modules"
// In each, specify the path to library or module files
// And the files to load in each

smuggler.config = {

  // Libraries include code already packaged for browsers
  // Anything you would simply put in <script> tags
  // Smuggler just loads them up naïvely

  // Smuggler will not import CDNs--
  // dynamic loading of foreign scripts will rightly
  // violate many browers' security policies.

  // Set library directory default; ends with a slash
  libraryPath: './lib/',

  // List libraries in loading order
  libraries: [],

  // Modules are Node-style Common JS exports

  // Only what is bound to module.exports will be available for
  // `require` calls. Trying to load a module that does not bind
  // module.exports will throw an error and stop application loading.

  // Beware: modules are still loaded as scripts
  // if you're not careful about scope could have nasty side effects.

  // Best practice is to use an IIFE:
  // module.exports = (() => { // code here // })()
  // Make require calls from inside the IIFE; modules are cached

  // Modules must be listed in order of dependency:
  // if script x `require`s script y, y must PRECEDE x in this list.

  // Set module directory default; ends with a slash
  modulePath: './app/',

  // List modules in loading order
  modules: []
}
