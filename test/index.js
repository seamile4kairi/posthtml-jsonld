'use strict'

const tester = require('ava')
const Builder = require('./util/Builder')

const _config = {
  root: 'test/fixtures',
  host: 'https://github.com',
  base: '/seamile4kairi/posthtml-jsonld',
  parents: [{
    url: 'https://github.com',
    title: 'Github'
  }, {
    url: 'https://github.com/seamile4kairi',
    title: 'seamile4kairi'
  }]
}

test('index', Object.assign(_config, {
  title: {
    fromParent: true,
    separator: ' » '
  },
  description: true,
  opengraph: {},
  twittercards: {},
  canonical: true,
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
