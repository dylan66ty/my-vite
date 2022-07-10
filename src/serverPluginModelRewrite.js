const { readBody } = require("./util");
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')

const rewriteImports = (source) => {
  if (source instanceof Buffer) return source
  const imports = parse(source)[0]
  const ms = new MagicString(source)
  if (imports.length > 0) {
    for (let i = 0; i < imports.length; i++) {
      const { s, e } = imports[i]
      let id = source.slice(s, e) // vue ./App.vue
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`
        ms.overwrite(s, e, id)
      }
    }
  }
  return ms.toString()
}

const moduleRewritePlugin = ({ app, root }) => {
  app.use(async (ctx, next) => {
    // 默认会先执行 静态服务中间件
    await next()
    // 需要将流转换成字符串
    if (ctx.body && ctx.response.is('js')) {
      const str = await readBody(ctx.body)
      // vue => /@modules/vue
      const result = rewriteImports(str)
      ctx.body = result
    }
  })
}

module.exports = moduleRewritePlugin