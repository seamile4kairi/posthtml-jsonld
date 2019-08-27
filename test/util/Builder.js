'use strict'

const posthtml = require('posthtml')
const plugin = require('../../')

const {
  join
} = require('path')
const {
  readFileSync
} = require('fs')

const template = name => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<jsonld src="${name}.json"></jsonld>
</head>
<body></body>
</html>
`

function Builder (name) {
  if (this === undefined) throw new TypeError()
  this.name = name
}

Builder.prototype = {
  constructor: Builder,

  run (options) {
    return posthtml([plugin(options)]).process(this.fixture)
  },

  get fixture () {
    return template(this.name)
  },

  get expect () {
    const path = join(process.cwd(), 'test', 'expects', `${this.name}.html`)
    return readFileSync(path, 'utf8')
  }
}

module.exports = Builder
