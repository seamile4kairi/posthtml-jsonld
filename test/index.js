'use strict'

const test = require('ava')
const Builder = require('./util/Builder')

test('index.html', async t => {
  const builder = new Builder('index')
  const result = await builder.run({
    root: 'test/fixtures',
    title: true,
    description: true
  })

  return t.is(builder.expect, result.html)
})
