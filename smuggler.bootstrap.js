// SMUGGLER: gives you unauthorized `exports`

// Allows for CommonJS/node.js-style `module.exports` and `require`,
// in-browser, without prepackaging, bundling, etc.

// Oh my, you should be using Webpack or Browserify or even RequireJS.
// This is for an unusual use case (an un-use case?).

// Modules must be specified, in loading order, in smuggler.config.js
// or whatever config file you pass

// basic error checking: don't load in node

'use strict'

if (typeof require !== `undefined`)
  throw Error(`require is already defined. ` +
    `Is there a conflict with another module loading system?`)

if (typeof module !== `undefined`)
  throw Error(`module.exports already exists. ` +
    `Is there is a conflict with another module loading system?`)

;((global) => {

  console.log(`Starting smuggler bootstrap.`)

  // get our main script, to run at the end
  let smugglerScript = document.currentScript,
    main = smugglerScript.getAttribute(`main`),
    configScript = smugglerScript.getAttribute(`config`)

  // default value for config location
  configScript = configScript || `smuggler.config.js`

  // private state: config and modules
  let modules = {}, config = {}

  // super handy helper function
  let pair = (key, value) => ({[key]: value})

  ////////////// CORE LOADING FUNCTIONS
  // load a script! // returns a promise for async/await goodness
  let load = (path) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${path}`)

    head.appendChild(script)

    return new Promise((resolve, reject) => {
      script.addEventListener('load',
        (e) => resolve(path))
      script.addEventListener('error',
        (e) => reject(`Failed to load file at ${path}.`))
    })
  }

  // Loads an array of files asynchronously and recursively (!!!)
  // Calls beforeEach and afterEach before and after loading,
  // passes the current file path to each function
  let loadFiles = async (files, beforeEach, afterEach) => {
    let [current, ...remaining] = files

    if (!current) return

    if (beforeEach) beforeEach(current)
    await load(current)
    if (afterEach) afterEach(current)
    await loadFiles(remaining, beforeEach, afterEach)
  }

  let loadingError = (file) => {
    throw Error(`Failed to load ${file}: check the file location.`)
  }

  //////////// This is where the magic happens
  // bootstrap smuggler and then load the application
  let bootstrap = async () => {
    // console.log(`Loading config.`)
    await load(`./${configScript}`)
    config = parseConfig(smuggler.config)
    // console.log(`Loading libraries.`)
    await loadFiles(config.libraries)
    // console.log(`Loading modules.`)
    await loadFiles(config.modules, cacheModule, bindModule)
    // console.log(`Loading main.`)
    module.loading = `./${main}`
    await load(main)
    // console.log(`Cleaning up.`)
    cleanUp()
    // console.log(`Done loading!`)
  }

  /////////// Synchronous loading functions
  // turns the raw config into what data we need here
  let parseConfig = (rawConfig) => {
    let libs = rawConfig.libraries.map(
      (lib) => `${rawConfig.libraryPath}${lib}`
    ),
    mods = rawConfig.modules.map(
      (mod) => `${rawConfig.modulePath}${mod}`
    )

    return {libraries: libs, modules: mods}
  }

  // don't pollute the global scope
  let cleanUp = () => {
    module.loading = `./[= approot]`

    delete global.module
    delete global.smuggler
  }

  // Pulls whatever a module binds to module.exports and saves it
  // in modules like so: {full module path : exports}
  let bindModule = (path) => {
    // console.log(`Binding module ${name}`)

    if (!module.exports)
      throw Error(`Module ${name} did not bind module.exports ` +
        `and cannot be loaded. This may be because of a script error.`)

    let exports = module.exports

    modules = Object.assign(modules, pair(path, exports))
    // console.log(`Modules now contains ${Object.keys(modules)}`)

    module.exports = null
    module.loading = null
  }

  // Stores whatever module we're loading so `require` calls in modules
  // are relative, not absolute (à la node)
  let cacheModule = (path) => {
    // console.log(`Caching module ${name}`)

    if (module.loading)
      throw Error(`Did not successfully bind module ${module.loading}.`)

    module.loading = path
  }

  /////////////// DEFINE require

  // helper functions to parse relative paths
  let parsePath = (pathToFile) => {
    let atoms = pathToFile.split('/'),
      length = atoms.length,
      path = atoms.slice(0, length - 1),
      file = atoms[length - 1]

    return {path, file}
  }

  let isCurrentDir = (str) => str === '.',
    isParentDir = (str) => str === '..',
    butLast = (arr) => arr.slice(0, arr.length - 1)

  let computePath = (path, relativeTo) => {
    let [current, ...remaining] = path
    if (isCurrentDir(current)) return relativeTo.concat(remaining).join('/')
    if (isParentDir(current)) try {
      return crawlPath(path, relativeTo).join('/')
    } catch (e) {
      throw Error(`Cannot find module at ${path.join('/')}.`)
    }

    throw Error(`Cannot find module at ${path.join('/')}.`)
  }

  let crawlPath = (path, relativeTo) => {
    let [current, ...remaining] = path
    if (relativeTo.length < 1) throw Error(`Crawled too many levels.`)
    if (isParentDir(current)) return crawlPath(remaining, butLast(relativeTo))
    return relativeTo.concat(remaining)
  }

  // the require goodness // it's remarkably easy!
  let require = (path) => {
    // console.log(`Requiring ${path} from ${module.loading}`)

    let loadingFrom = parsePath(module.loading),
      relative = parsePath(path),
      absolute = computePath(relative.path, loadingFrom.path),
      requirePath = `${absolute}/${relative.file}`

    let required = modules[requirePath]

    if (required) return required

    throw Error(`Module at ${path} has not been loaded. ` +
                `Check that there is a module at ${path}, ` +
                `for circular dependencies, and for proper loading ` +
                `order in smuggler config file.`)
  }

  ////////////// STOP DEFINING FUNCTIONS
  ///////////// Start loading things

  // give smuggler a global object to work with
  // config loads itself into this object
  global.smuggler = {}

  // construct a global module.exports object
  let module = {}

  module.exports = null
  module.loading = null

  global.module = module

  // export require into global scope
  // this will be the only one not removed
  global.require = require

  // load it up!
  bootstrap()

})(window)
