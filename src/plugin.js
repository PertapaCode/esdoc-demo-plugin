const path = require('path')
const fs = require('fs-extra')

module.exports = class {

  constructor (options = {scripts: []}) {
    this._options = options

    this.copy()
  }

  exec (ev) {
    let html = ev.data.html

    if (html.indexOf('exampleDocs') === -1) {
      return
    }

    // inject demo.js in the header
    let idx = html.indexOf('</title>')
    let script = `
    <script src="script/demo/index.js"></script>
    <script>
      window.demo.exec(${JSON.stringify(this._options)});
    </script>
    `
    html = html.slice(0, idx + 8) + script + html.slice(idx + 8)

    ev.data.html = html
  }

  copy () {

    for (let i = 0; i < this._options.scripts.length; i++) {
      let s = this._options.scripts[i]
      fs.copySync(
        path.resolve(process.cwd(), s),
        path.resolve(process.cwd(), './doc/script/demo/' + s.split('/').pop())
      )
    }

    fs.copySync(
      path.resolve(process.cwd(), './node_modules/esdoc-demo-plugin/src/demo.js'),
      path.resolve(process.cwd(), './doc/script/demo/index.js')
    )
  }
}
