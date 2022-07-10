const path = require('path')
const fs = require('fs').promises

const pluginVue = ({ app, root }) => {
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return next()
    }
    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf-8')
    // 解析模板
    const complier = require(path.resolve(root, 'node_modules', '@vue/compiler-sfc/dist/compiler-sfc.cjs.js'))
    const { compileTemplate, parse } = complier
    const { descriptor } = parse(content)
    if (!ctx.query.type) {
      let code = ''
      if (descriptor.script) {
        const content = descriptor.script.content
        code += content.replace(/((?:^|\n|;)\s*)export default/, '$1const __script=')
      }
      if (descriptor.template) {
        const requestPath = ctx.path + '?type=template'
        code += `\nimport {render as __render} from "${requestPath}"`
        code += `\n__script.render = __render`
      }
      code += `\nexport default __script`
      ctx.type = 'js'
      ctx.body = code
    }
    if (ctx.query.type === 'template') { // ./HelloWorld.vue?type=template
      const content = descriptor.template.content
      // 转换成render函数
      const { code } = compileTemplate({ source: content })
      ctx.type = 'js'
      ctx.body = code
    }


  })

}

module.exports = pluginVue