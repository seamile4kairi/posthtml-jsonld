'use strict'

const test = require('ava')
const Builder = require('./util/Builder')

test('index.html', async t => {
  const builder = new Builder('index')
  const result = await builder.run({
    root: 'test/fixtures',
  })

  return t.is(builder.expected, result.html)
})
