const Koa = require('koa')
const moduleRewritePlugin = require('./serverPluginModelRewrite')
const serveStaticPlugin = require('./serverPluginServeStatic')
const moduleResolvePlugin = require('./serverPluginModuleResolve')
const pluginVue = require('./serverPluginVue')

function createServer() {
  let app = new Koa()

  const context = {
    app,
    root: process.cwd()
  }

  const reslovePlugin = [
    moduleRewritePlugin, // 重写请求路径 
    moduleResolvePlugin,
    pluginVue, // 解析vue文件
    serveStaticPlugin, // 静态服务插件
  ]

  reslovePlugin.forEach(plugin => plugin(context))


  return app
}

createServer().listen(4000, () => {
  console.log('vite start 4000');
})