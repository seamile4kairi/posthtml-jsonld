# PostHTML JSON-LD <img align="right" width="220" height="200" title="PostHTML logo" src="//posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
<!-- [![Deps][deps]][deps-url] -->
<!-- [![Build][build]][build-badge] -->
<!-- [![Coverage][cover]][cover-badge] -->
<!-- [![Standard Code Style][style]][style-url] -->
<!-- [![Chat][chat]][chat-badge] -->

Import an external file written in JSON-LD format, and insert it with ``<meta>`` tags.

### Before:

#### ``~/index.html``
``` html
<!DOCTYPE html>
<html>
<head>
<jsonld src="./index.json"></jsonld>
</head>
<body>
</body>
</html>
```

#### ``~/index.json``
```json
{
  "@context": "http://schema.org",
  "@type": "Website",
  "url": "@/",
  "name": "PostHTML JSON-LD",
  "description": "PostHTML plugin to import JSON-LD from the external JSON file",
  "image": {
    "@type": "ImageObject",
    "url": "~/assets/images/ogimage.png",
    "width": 1200,
    "height": 630
  }
}
```

### After:

``` html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>PostHTML JSON-LD</title>
<meta name="description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta property="og:type" content="website">
<meta property="og:title" content="PostHTML JSON-LD">
<meta property="og:description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta property="og:url" content="https://github.com/seamile4kairi/posthtml-jsonld">
<meta property="og:image" content="https://github.com/seamile4kairi/posthtml-jsonld/assets/images/ogimage.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PostHTML JSON-LD">
<meta name="twitter:description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta name="twitter:url" content="https://github.com/seamile4kairi/posthtml-jsonld">
<meta name="twitter:image" content="https://github.com/seamile4kairi/posthtml-jsonld/assets/images/ogimage.png">
<link rel="canonical" href="https://github.com/seamile4kairi/posthtml-jsonld">
<link rel="alternate" media="only screen and (max-width: 560px)" href="https://github.com/seamile4kairi/posthtml-jsonld/sp/">
<link rel="alternate" hreflang="en" href="https://github.com/seamile4kairi/posthtml-jsonld/en/">
<script type="application/ld+json">{"@context":"http://schema.org","@type":"Website","url":"https://github.com/seamile4kairi/posthtml-jsonld","name":"PostHTML JSON-LD","description":"PostHTML plugin to import JSON-LD from the external JSON file","image":[{"@type":"ImageObject","url":"/seamile4kairi/posthtml-jsonld/assets/images/ogimage.png","width":1200,"height":630}]}</script>
</head>
<body></body>
</html>
```


## Install

```bash
$ npm i -D posthtml posthtml-jsonld
```


## Usage

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlPlugin = require('posthtml-jsonld');

posthtml()
    .use(posthtmlPlugin({ /* options */ }))
    .process(html/*, options */)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

root
:   ``String`` (Default: ``./``)
:   The path to the root directory of JSON files.

host
:   ``String`` (Default: ``http://localhost``)
:   Protocol & hostname of the site.

base
:   ``String`` (Default: ``/``)
:   Base path of the site.

title
:   ``Object``
:   Page tile.
:   *Add the detail later*

description
:   ``String``
:   Page description.

opengraph
:   ``Object``
:   Configrations for Open Graph.
:   *Add the detail later*

twittercards
:   ``Object``
:   Configrations for Twitter Card.
:   *Add the detail later*

canonical
:   ``Boolean`` (Default: ``false``)
:   Require ``link[rel="canonical"]``?

alternate
:   ``Array<Object>``
:   Alternative URLs (``link[rel="alternate"]``) for the page.

alternate[].href
:   *Required*
:   ``Function``
:   e.g.) ``url => url.replace(/\/\/www\./, '//ja.')``

alternate[].hreflang, alternate[].media
:   ``String``
:   Condition to apply alternative URLs.


## Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).


## License [MIT](LICENSE)


<!-- Links -->

[npm]: https://img.shields.io/npm/v/posthtml-jsonld.svg
[npm-url]: https://npmjs.com/package/posthtml-jsonld

[deps]: https://david-dm.org/seamile4kairi/posthtml-jsonld.svg
[deps-url]: https://david-dm.org/posthtml/posthtml-jsonld

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[build]: https://travis-ci.org/seamile4kairi/posthtml.svg?branch=master
[build-badge]: https://travis-ci.org/seamile4kairi/posthtml?branch=master

[cover]: https://coveralls.io/repos/seamile4kairi/posthtml/badge.svg?branch=master
[cover-badge]: https://coveralls.io/r/seamile4kairi/posthtml?branch=master


[chat]: https://badges.gitter.im/seamile4kairi/posthtml.svg
[chat-badge]: https://gitter.im/seamile4kairi/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
