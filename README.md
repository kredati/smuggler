# Smuggler: Unauthorized `exports`

## What
Node-style `exports` and `require` in-browser, using ES7 async/await.

It works well enough. It makes a number of compromises. It does not target older browsers. You should use Webpack or Browserify or RequireJS. This is all stopgap until we finally get ES6 modules—any time now.

Smuggler bootstraps itself, then loads all specified scripts naïvely. Then it loads all specified modules, making them available for `require` calls as it goes. The semantics of these `require`s precisely shadow node's. This exposes node's testing and other capacities, and allows authors to target both node and the browser at the same time.

In this, Smuggler is not unique. However, unlike Require1K (which loads scripts *without* a config file, among other goodies) Smuggler maintains the line numbers of the source modules for debugging and works on a local machine. Meanwhile, it's much simpler to use than RequireJS, and enforces node's (8.0.0) precise `require` semantics.

## Why
Smuggler was developed as part of turtle.js. Turtle.js is deeply pedagogical, functional turtle graphics in JS. Turtle.js is meant to be downloaded and used locally, and also to expose its entire codebase to learners. The aspiration is that the entire codebase would be readable as the curriculum progresses. At current, Smuggler doesn't come close to succeeding in that aspiration. File loading is messy and stateful and procedural plumbing.

## Why not
It's tested, but not thoroughly so (I'm calling this 0.0.1 alpha). It doesn't handle circular dependencies. It loads all required scripts and modules, in order, *before* progressing to the main script, which probably isn't very fast (although it shouldn't block html rendering). (This isn't a problem running on a local machine, which is the particular use case here.)

## How
Put `smuggler.bootstrap.js` and `smuggler.config.js` the root of your webapp. Then, in `index.html`, include the following:
```html
<script src="smuggler.bootstrap.js" main="index.js"></script>
```
Replace `index.js` with whatever file is the main mount point for your application.

Smuggler looks for its config file at `smuggler.config.js`. You can also include a `config` attribute that points Smuggler to a config file somewhere else. The config file tells Smuggler where to look for scripts and what order to load them in. (This is annoying, but so far as I can tell, necessary if you want to avoid `eval` and do your stuff locally.)

The config file's structure is thus:
```javascript
smuggler.config = {
  libraryPath = './library/', // relative to application root, can be changed
  libraries = [
    'library_file1.js',
    'library_file2.js' // etc
  ],
  modulePath = './modules/',
  modules = [
    'module1.js',
    'module2.js' // etc
  ]
}
```
The difference between library scripts and modules is that library files are executed as scripts—run naïvely, without expectation that they bind `module.exports`, and with their results not available to calls to `require`. Modules must bind `module.exports`. Smuggler will stop loading and throw an error if a file loaded as a module doesn't bind module.exports.

Smuggler can't prevent scripts loaded as modules from making changes to global state. Probably that's okay, but it would be nice to have assurances anyway. Best practice for complete node/browser interoperability is to wrap your code in an IIFE, binding it to `module.exports`, and returning whatever you want to expose to the wider world:
```javascript
module.exports = (() => {

  const module1 = require('./module1.js'),
    module2 = require('./module2.js') //etc

  // do stuff

  return {foo: 'bar'} // or whatever you want to expose

})()
```
