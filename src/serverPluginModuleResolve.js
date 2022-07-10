const RE = /^\/@modules\//
const path = require('path')
const fs = require('fs').promises

const moduleResolvePlugin = ({ app, root }) => {
  app.use(async (ctx, next) => {
    if (!RE.test(ctx.path)) {
      return next()
    }
    const id = ctx.path.replace(RE, '')
    const mapping = {
      vue: path.resolve(root, 'node_modules', '@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js')
    }
    const content = await fs.readFile(mapping[id])
    ctx.type = 'js'
    ctx.body = content
  })

}

module.exports = moduleResolvePlugin
