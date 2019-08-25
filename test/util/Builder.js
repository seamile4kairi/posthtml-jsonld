'use strict'

const posthtml = require('posthtml')
const plugin = require('../../')

const {
  join,
} = require('path')
const {
  readFileSync,
} = require('fs')

function Builder (name) {
  if (this === undefined) throw new TypeError()
  this.name = name
}

Builder.prototype = {
  constructor: Builder,

  run (options) {
    return posthtml([
      plugin(options),
    ])
    .process(this.fixture)
  },

  get fixture () {
    return this.read('fixtures');
  },

  get expect () {
    return this.read('expects');
  },

  read (dir) {
    const path = join(process.cwd(), 'test', dir, `${this.name}.html`)
    return readFileSync(path, 'utf8')
  },
}

module.exports = Builder
