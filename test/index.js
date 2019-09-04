'use strict'

const test = require('ava')
const Builder = require('./util/Builder')

test('index.html', async t => {
  const builder = new Builder('index')
  const result = await builder.run({
    root: 'test/fixtures',
    protocol: 'https',
    domain: 'github.com',
    basePath: '/seamile4kairi/posthtml-jsonld',
    title: {},
    description: {},
    opengraph: {},
    twittercards: {},
    canonical: true
  })

  return t.is(builder.expect, result.html)
})
