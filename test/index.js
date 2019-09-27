'use strict'

const tester = require('ava')
const Builder = require('./util/Builder')

const _config = {
  root: 'test/fixtures',
  host: 'https://github.com',
  base: '/seamile4kairi/posthtml-jsonld',
  parents: [{
    url: 'https://github.com/seamile4kairi/posthtml-jsonld',
    title: 'PostHTML JSON-LD'
  }],
  canonical: true
}

test('index', Object.assign({}, _config, {
  title: {},
  description: true,
  opengraph: {},
  twittercards: {}
}))

test('sub/index', Object.assign({}, _config, {
  title: {
    fromParent: true,
    separator: ' » '
  },
  description: true,
  opengraph: {},
  twittercards: {},
  alternate: [{
    media: 'only screen and (max-width: 560px)',
    href: url => url.replace(/\/$/, '') + '/sp/'
  }, {
    hreflang: 'en',
    href: url => url.replace(/\/$/, '') + '/en/'
  }]
}))

function test (name, config) {
  return tester(name, async t => {
    const builder = new Builder(name)
    const result = await builder.run(config)

    return t.is(builder.expect, result.html)
  })
}
