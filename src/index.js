const Plugin = require('./plugin')
let plugin

exports.onStart = function (ev) {
  plugin = new Plugin(ev.data.option)
}

exports.onHandleHTML = function (ev) {
  plugin.exec(ev)
}
