const fs = require('fs')
const {join} = require('path')

const content = fs
.readFileSync(join(__dirname, '..', 'index.js'), 'utf-8')
.toString()
.replace(
  /\/\/\sCOMMONJS_EXPORTS[\s\S]+$/,
  `
export {
  isPathValid
}

export default factory
  `
)

fs.writeFileSync(join(__dirname, '..', 'index.mjs'), content)