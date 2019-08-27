# PostHTML JSON-LD <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
<!-- [![Deps][deps]][deps-url] -->
<!-- [![Build][build]][build-badge] -->
<!-- [![Coverage][cover]][cover-badge] -->
<!-- [![Standard Code Style][style]][style-url] -->
<!-- [![Chat][chat]][chat-badge] -->

Import an external file written in JSON-LD format, and insert it with ``<meta>`` tags.

### Before:
``` html
<html>
<head>
<jsonld src="./index.json"></jsonld>
</head>
<body>
</body>
</html>
```
```json
{
  "@context": "http://schema.org",
  "@type": "Website",
  "url": "https://github.com/seamile4kairi/posthtml-jsonld",
  "name": "PostHTML JSON-LD",
  "description": "PostHTML plugin to import JSON-LD from the external JSON file",
  "image": {
    "@type": "ImageObject",
    "url": "https://dummyimage.com/1200x630/eee/fff.png",
    "width": 1200,
    "height": 630
  }
}
```

### After:
``` html
<html>
<head>
<title>PostHTML JSON-LD</title>
<meta name="description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta property="og:type" content="website">
<meta property="og:title" content="PostHTML JSON-LD">
<meta property="og:description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta property="og:url" content="https://github.com/seamile4kairi/posthtml-jsonld">
<meta property="og:image" content="https://dummyimage.com/1200x630/eee/fff.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PostHTML JSON-LD">
<meta name="twitter:description" content="PostHTML plugin to import JSON-LD from the external JSON file">
<meta name="twitter:url" content="https://github.com/seamile4kairi/posthtml-jsonld">
<meta name="twitter:image" content="https://dummyimage.com/1200x630/eee/fff.png">
<link rel="canonical" href="https://github.com/seamile4kairi/posthtml-jsonld">
<script type="application/ld+json">{"@context":"http://schema.org","@type":"Website","url":"https://github.com/seamile4kairi/posthtml-jsonld","name":"PostHTML JSON-LD","description":"PostHTML plugin to import JSON-LD from the external JSON file","image":[{"@type":"ImageObject","url":"https://dummyimage.com/1200x630/eee/fff.png","width":1200,"height":630}]}</script>
</head>
<body>
</body>
</html>
```

## Install

Describe how big guys can install your plugin.

```bash
$ npm i posthtml posthtml-jsonld
```

## Usage

Describe how people can use this plugin. Include info about build systems if it's
necessary.

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

### root

- Type: ``String``
- Default: ``./``

The path to the root directory of JSON files.

### url

- Type: ``Object``
- Default: ``false``

(Add the detail later)

### title

- Type: ``Object``
- Default: ``false``

(Add the detail later)

### description

- Type: ``Object``
- Default: ``false``

(Add the detail later)

### opengraph

- Type: ``Object``
- Default: ``false``

(Add the detail later)

### twittercards

- Type: ``Object``
- Default: ``false``

(Add the detail later)

## Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).

## License [MIT](LICENSE)

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
