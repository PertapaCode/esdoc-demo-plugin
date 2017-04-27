/**
 * injected script in esdoc page
 */
window.demo = {

  /**
   * execute script
   * @param  {Object} options
   * @return {void}
   */
  exec: function (options) {
    this.DOMReady(this.create.bind(this, options))
  },

  /**
   * create text editor and iframe to run code
   * @param {Object} options
   * @return {void}
   */
  create: function (options) {
    // console.log('create', options)
    let tmpCodeContainerEl =
      document.querySelectorAll("[data-ice='exampleDocs']")[0]
    let element = tmpCodeContainerEl.parentElement

    // remove original code element
    tmpCodeContainerEl.parentNode.removeChild(tmpCodeContainerEl)

    this.editor = this._initTextEditor(element)
    let editorButtons = this._initTextEditorButtons(element)

    // create demo title element
    let demoTitleEl = document.createElement('h2')
    demoTitleEl.setAttribute('id', 'ui-example-title')
    demoTitleEl.innerHTML = 'Demo'
    element.appendChild(demoTitleEl)

    // create iframe
    let iframeEl = document.createElement('iframe')
    iframeEl.style.width = '100%'
    iframeEl.style.border = 'none'
    iframeEl.style.resize = 'both'
    iframeEl.style.overflow = 'auto'
    iframeEl.style.height = '400px'
    iframeEl.src = this._getDemoUrl(options.componentName)
    element.appendChild(iframeEl)

    // set default code
    this.editor.setValue(options.code, -1)

    editorButtons.run.addEventListener('click',
      this.updateIframe.bind(this, iframeEl))
    editorButtons.default.addEventListener('click',
      this.editor.setValue.bind(this.editor, options.code, -1))
  },

  /**
   * check for DOMReady
   * @param {Function} cb - The callback function.
   * @return {void}
   */
  DOMReady: function (cb) {
    if (document.readyState === 'complete') {
      cb()
    } else {
      window.addEventListener('DOMContentLoaded', cb, false)
    }
  },

  /**
   * get url for demo page
   * @param  {string} componentName
   * @return {string} demoURL
   */
  _getDemoUrl (componentName) {
    let demoURL = (window.location !== window.parent.location)
      ? document.referrer
      : document.location.href

    if (demoURL.indexOf('/doc/') !== -1) {
      demoURL = demoURL.substring(0, demoURL.indexOf('/doc/') + 5)
    } else {
      demoURL = demoURL.substring(0, demoURL.indexOf('/class/'))
      demoURL += '/'
    }

    demoURL = demoURL + 'script/demo/' + componentName + '.html'

    return demoURL
  },

  /**
   * create text editor
   * @param  {DOMElement} element
   * @return {Object} editor
   */
  _initTextEditor (element) {
    // console.log('_initTextEditor', element)
    let codeEl = document.createElement('div')
    codeEl.style.height = '400px'
    element.appendChild(codeEl)

    let editor = ace.edit(codeEl)
    let JavaScriptMode = ace.require('ace/mode/javascript').Mode
    editor.setTheme('ace/theme/monokai')
    editor.session.setMode(new JavaScriptMode())

    return editor
  },

  /**
   * create text editor buttons
   * @param  {DOMElement} element
   * @return {Object} buttons
   */
  _initTextEditorButtons (element) {
    // console.log('_initTextEditorButtons', element)
    let buttonRunEl = document.createElement('button')
    buttonRunEl.style.padding = '10px'
    buttonRunEl.innerHTML = 'run'
    element.appendChild(buttonRunEl)

    let buttonDefaultEl = document.createElement('button')
    buttonDefaultEl.style.padding = '10px'
    buttonDefaultEl.style.marginLeft = '5px'
    buttonDefaultEl.innerHTML = 'default'
    element.appendChild(buttonDefaultEl)

    return {
      run: buttonRunEl,
      default: buttonDefaultEl
    }
  },

  /**
   * update iframe content
   * @param  {DOMElement} iframe
   * @return {void}
   */
  updateIframe (iframe) {
    // console.log('updateIframe', iframe)
    let code = this.editor.getValue()
    let iframeContent = iframe.contentWindow ||
                        iframe.contentDocument.document ||
                        iframe.contentDocument

    // empty iframe body
    iframeContent.document.body.innerHTML = ''

    // create script tag for code
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = code

    var iframeHead = iframeContent.document.getElementsByTagName('head')[0]
    iframeHead.appendChild(script)
  }

}

