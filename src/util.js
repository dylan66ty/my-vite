const { Readable } = require('stream')

const readBody = (stream) => {
  return new Promise((resolve) => {
    if (stream instanceof Readable) {
      let str = ''
      stream.on('data', (chunk) => {
        str += chunk
      })
      stream.on('end', () => {
        resolve(str)
      })
    } else {
      resolve(stream)
    }
  })
}

module.exports = {
  readBody
}