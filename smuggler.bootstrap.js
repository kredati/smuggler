// SMUGGLER: gives you unauthorized `exports`

// Allows for CommonJS/node.js-style `module.exports` and `require`,
// in-browser, without prepackaging, bundling, etc.

// Oh my, you should be using Webpack or Browserify or even RequireJS.
// This is an unusual use case (an un-use case?).

// Modules must be specified, in loading order, in smuggler.config.js

// basic error checking: don't load in node
if (typeof require !== `undefined`) throw Error(`require is already defined. Is there a conflict with another module loading system?`)

if (typeof module !== `undefined`) throw Error(`module.exports already exists. Is there is a conflict with another module loading system?`)

;((global) => {

  console.log(`Running smuggler bootstrap.`)

  // get our main script, to run at the end
  let smugglerScript = document.currentScript,
    main = smugglerScript.getAttribute(`main`)

  // private state: config and modules
  modules = {}
  config = {}

  // super handy helper function
  let pair = (key, value) => ({[key]: value})

  // load a script!

  let load = (path) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${path}`)

    head.appendChild(script)

    return new Promise((resolve, reject) => {
      script.addEventListener('load', (e) => resolve(path))
      script.addEventListener('error', (e) => reject(`Failed to load file at ${path}.`))
    })
  }

  let parseConfig = (rawConfig) => {
    console.log(rawConfig)
    let libs = rawConfig.libraries.map(
      (lib) => `${rawConfig.libraryPath}${lib}`
    ),
    mods = rawConfig.modules.map(
      (mod) => `${rawConfig.modulePath}${mod}`
    )

    return {libraries: libs, modules: mods}
  }
  global.parseConfig = parseConfig

  let loadConfig_promise = () =>
    load('./smuggler.config.js')
      .then((path) => {
        console.log(`Loaded config at ${path}.`)
        config = parseConfig(smuggler.config)
        loadLibs()
      })
      .catch((msg) => { throw Error(msg) })

  let bootstrap = async () => {
    await load('./smuggler.config.js')
    config = parseConfig(smuggler.config)
    await loadLibs()
    prepModules()
    await loadModules()
    await loadMain()
    cleanUp()
    console.log(`Done loading!`)
  }

  let loadMain = async () => await load(main)

  let cleanUp = () => {
    delete global.module
    delete global.smuggler
  }

  let loadConfig = async () => {
    let path = await load('./smuggler.config.js')
    console.log(`awaited ${path}!`)
    config = parseConfig(smuggler.config)
    loadLibs()
  }

  let doneLoading = () => {
    console.log(`Done loading modules!`)
    load(main)
      .then(() => {
        // clean up after ourselves
        delete global.module
        delete global.smuggler

        console.log(`Finished bootstrap!`)
      })
      .catch(() => { throw Error(`Cannot find main script: ${main}.`) })
  }

  let loadingError = (file) => {
    throw Error(`Failed to load ${file}: check the file location.`)
  }

  let loadFiles_async = async (files, afterEach) => {
    let [current, ...remaining] = files

    if (!current) return

    await load(current)
    if (afterEach) afterEach(current)
    await loadFiles_async(remaining, afterEach)
  }

  let loadFiles = (files, afterEach, then) => {
    let [current, ...remaining] = files

    if (current) {
      console.log(`Loading ${current}`)
      load(current)
        .then(() => {
          afterEach(current)
          loadFiles(remaining, afterEach, then)
        })
        .catch(loadingError)
    } else {
      then()
    }
  }

  let loadLibs = async () => {
    await loadFiles_async(config.libraries)
    console.log(`Awaited library loading!`)
  }

  let loadLibs_p = () => {
    loadFiles(config.libraries, () => {}, prepModules)
  }

  let prepModules = () => {
    modules = config.modules.reduce(
      (obj, module) => Object.assign(pair(module, null)),
      modules)
  }

  let bindModule = (name) => {
    console.log(`Binding module ${name}`)

    if (!module.exports)
      throw Error(`Module ${name} did not bind module.exports and cannot be loaded. This may be because of a script error.`)

    let exports = module.exports

    modules = Object.assign(modules, pair(name, exports))
    console.log(`Modules now contains ${Object.keys(modules)}`)

    module.exports = null
  }

  let loadModules_p = () => loadFiles(config.modules, bindModule, doneLoading)

  let loadModules = async () => {
    await loadFiles_async(config.modules, bindModule)
  }

  // Start fucking with global state

  // give smuggler a global object to work with
  global.smuggler = {}

  // construct a global module.exports object
  let module = {}

  module.exports = null
  global.module = module

  global.require = (path) => {
    let required = modules[path]

    if (required) return required

    throw Error(`Module at ${path} has not been loaded. ` +
                `Check that there is a module at ${path}, ` +
                `for circular dependencies, and for proper loading` +
                `order in smuggler.config.js.`)
  }

  // kick of a loading frenzy
  bootstrap()

})(window)
