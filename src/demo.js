window.demo = {

  exec: function (options) {
    this.DOMReady(this.set.bind(this, options))
  },

  set: function (options) {
    // console.log('set', options)

    const els = document.querySelectorAll("[data-ice='exampleDocs']")
    let name = window.location.href
    name = name.substring(name.lastIndexOf('~') + 1, name.lastIndexOf('.'))
    name = name.charAt(0).toUpperCase() + name.slice(1)

    if (!els || !els[0]) {
      return
    }

    // console.log('name', name)

    let el = els[0]
    let parentEl = el.parentElement
    let code = el.getElementsByClassName('example-doc')[0].innerText

    let scriptsTmpl = ''
    for (let i = 0; i < options.scripts.length; i++) {
      let s = options.scripts[i]

      if (s.split('.').pop() === 'js') {
        scriptsTmpl += `<script src="../../../script/demo/${s.split('/').pop()}"></script>`
      } else {
        scriptsTmpl += `<link type="text/css" rel="stylesheet" href="../../../script/demo/${s.split('/').pop()}">`
      }
    }

    // console.log('scriptsTmpl', scriptsTmpl)

    let template = `
    <html>
      <head>
        ${scriptsTmpl}
      </head>
      <body>
      </body>
      <script>
        ${code}
      </script>
    </html>
    `

    let demoTitleEl = document.createElement('h2')
    demoTitleEl.setAttribute('id', 'ui-example-title')
    demoTitleEl.innerHTML = 'Demo'
    parentEl.appendChild(demoTitleEl)

    // init iframe
    let iframe = document.createElement('iframe')
    iframe.style.width = '100%'
    iframe.style.border = 'none'
    iframe.style.resize = 'both'
    iframe.style.overflow = 'auto'
    parentEl.appendChild(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(template)
    iframe.contentWindow.document.close()
  },

  DOMReady: function (cb) {
    if (document.readyState === 'complete') {
      cb()
    } else {
      window.addEventListener('DOMContentLoaded', cb, false)
    }
  }
}

