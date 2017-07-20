const path = require('path')
const fs = require('fs-extra')

/**
 * Create a html demo page for each entry point in src/index.js
 */
module.exports = class {

  /**
   * constructor
   * @param  {Object} options
   * @return {void}
   */
  constructor (options = { scripts: [] }) {
    this._options = options
    this.scriptsTmpl = this._generateScripts()
    this._copy()
  }

  /**
   * exec
   * @param  {Object} ev
   * @return {void}
   */
  exec (ev) {
    let html = ev.data.html

    // stop if exampleDocs is not found
    if (html.indexOf('exampleDocs') === -1) {
      return
    }

    let opts = {}

    // default code
    let code = html.indexOf('exampleCode">')
    code = html.substring(code)
    code = code.substring(13, code.indexOf('</code>'))
    code = code.replace(/&apos;/g, "'")
               .replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&')
    opts.code = code

    // component name
    let componentName = html.indexOf('new ')
    componentName = html.substring(componentName)
    componentName = componentName.substring(4, componentName.indexOf('({'))
    componentName = componentName.split('.').pop()
    componentName = componentName.toLowerCase()
    opts.componentName = componentName

    // html for demo page
    const demoHTML = `
      <html>
      <head>
        ${this.scriptsTmpl.join('')}
      </head>
      <body>
        <script>
          ${code}
        </script>
      </body>
      </html>
    `

    // write demo page
    fs.writeFile(path.resolve(process.cwd(), './docs/script/demo/' + componentName + '.html'), demoHTML)

    // modify esdoc page head with demo
    let esdocHTML = `
      <script src="script/demo/index.js"></script>
      <script src="script/demo/ace/ace.js"></script>
      <script src="script/demo/ace/mode-javascript.js" type="text/javascript" charset="utf-8"></script>
      <script src="script/demo/ace/theme-monokai.js" type="text/javascript" charset="utf-8"></script>
      <script>
        window.demo.exec(${JSON.stringify(opts)});
      </script>
    `

    // modify head
    let titleElIndex = html.indexOf('</title>')
    html = html.slice(0, titleElIndex + 8) + esdocHTML + html.slice(titleElIndex + 8)
    ev.data.html = html
  }

  /**
   * copy dependencies
   * @return {void}
   */
  _copy () {
    // copy demo.js to be used by the esdoc pages
    fs.copySync(
      path.resolve(process.cwd(), './node_modules/esdoc-demo-plugin/src/demo.js'),
      path.resolve(process.cwd(), './docs/script/demo/index.js')
    )

    // copy ace to be used by the esdoc pages
    fs.copySync(
      path.resolve(process.cwd(), './node_modules/esdoc-demo-plugin/node_modules/ace/build/src-min'),
      path.resolve(process.cwd(), './docs/script/demo/ace')
    )

    // copy dependencies
    for (let i = 0; i < this._options.scripts.length; i++) {
      let scriptPath = this._options.scripts[i]
      let fileName = scriptPath.split('/').pop()

      fs.copySync(
        path.resolve(process.cwd(), scriptPath),
        path.resolve(process.cwd(), './docs/script/demo/' + fileName)
      )
    }
  }

  /**
   * generate scripts
   * @return {void}
   */
  _generateScripts () {
    let scriptsTmpl = [
      '<script src="index.js"></script>'
    ]

    for (let i = 0; i < this._options.scripts.length; i++) {
      let scriptPath = this._options.scripts[i]
      let fileName = scriptPath.split('/').pop()

      if (scriptPath.indexOf('.css') !== -1) {
        scriptsTmpl.push('<link type="text/css" rel="stylesheet" href="' + fileName + '">')
      } else {
        scriptsTmpl.push('<script src="' + fileName + '"></script>')
      }
    }

    return scriptsTmpl
  }

}
