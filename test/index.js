'use strict'

const test = require('ava')
const Builder = require('./util/Builder')

test('index.html', async t => {
  const builder = new Builder('index')
  const result = await builder.run({
    root: 'test/fixtures',
    host: 'https://github.com',
    base: '/seamile4kairi/posthtml-jsonld',
    title: {},
    description: {},
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
  })

  return t.is(builder.expect, result.html)
})
