import {
  resolve
} from 'path'
import util from 'util'

const errors = {
  hasNoSrc: '<jsonld> has no [src] attribute.',
  notFound: 'Required JSON was not found.',
  isInvalid: 'Required JSON may be invalid. Check the file in: https://search.google.com/structured-data/testing-tool/'
}

export default (options = {}) => tree => {
  options = Object.assign({
    root: './',
    url: false,
    title: false,
    description: false,
    opengraph: false,
    twittercards: false
  }, options)

  tree = tree.match({
    tag: 'jsonld'
  }, node => {
    if (!node.attrs || !node.attrs.src) {
      throw getError(errors.hasNoSrc)
    }

    const data = new JsonLd(node.attrs.src, options)

    return data.nodes
  })

  return tree
}

class JsonLd {
  constructor (src, options) {
    this.src = src
    this.options = options
  }

  get nodes () {
    const nodes = []

    // title
    if (this.options.title && this._title) {
      nodes.push(this.title, '\n')
    }

    // meta[name="description"]
    if (this.options.description) {
      nodes.push(this.description || '', '\n')
    }

    // meta[property="og:*"]
    if (this.options.opengraph) {
      nodes.push(this.opengraph, '\n')
    }

    // meta[name="twtter:*"]
    if (this.options.twittercards) {
      nodes.push(this.twittercards, '\n')
    }

    // link[rel="canonical"]
    if (this._url) {
      nodes.push(this.url, '\n')
    }

    // script[type="application/ld+json"]
    nodes.push(this.script)

    return {
      tag: false,
      content: [
        nodes
      ]
    }
  }

  get script () {
    return {
      tag: 'script',
      attrs: {
        type: 'application/ld+json'
      },
      content: [
        JSON.stringify(this.data)
      ]
    }
  }

  get _url () {
    const options = this.options.url
    return options.canonical || this.data.url
  }

  get url () {
    if (!this._url) return

    // const options = this.options.url
    const nodes = []

    nodes.push({
      tag: 'link',
      attrs: {
        rel: 'canonical',
        href: this._url
      }
    })

    return nodes
  }

  get _title () {
    return this.data.name || this.data.headline
  }

  get title () {
    if (!this._title) return

    return {
      tag: 'title',
      content: [
        this._title
      ]
    }
  }

  get description () {
    return {
      tag: 'meta',
      attrs: {
        name: 'description',
        content: this.data.description
      }
    }
  }

  get opengraph () {
    const options = this.options.opengraph
    const nodes = []

    // meta[property="og:type"]
    let type = options.type || this.data['@type']
    switch (type) {
      case 'Article':
      case 'NewsArticle':
      case 'BlogPosting':
        type = 'article'
        break

      case 'Product':
        type = 'product'
        break

      default:
        type = 'website'
    }
    nodes.push({
      tag: 'meta',
      attrs: {
        property: 'og:type',
        content: type
      }
    })

    // meta[property="og:title"]
    if (this._title) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          property: 'og:title',
          content: this._title
        }
      })
    }

    // meta[property="og:description"]
    if (this.data.description) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          property: 'og:description',
          content: this.data.description
        }
      })
    }

    // meta[property="og:url"]
    if (this._url) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          property: 'og:url',
          content: this._url
        }
      })
    }

    // meta[property="og:image"]
    if (this.data.image && this.data.image.length > 0) {
      this.data.image.forEach(img => {
        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: img.url
          }
        })
      })
    }

    // meta[property="og:video"]
    if (this.data.video && this.data.video.length > 0) {
      this.data.video.forEach(video => {
        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            property: 'og:video',
            content: video.contentUrl
          }
        })
      })
    }

    // meta[property="fb:app_id"]
    if (options.app_id) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          property: 'fb:app_id',
          content: options.app_id
        }
      })
    }

    return nodes
  }

  get twittercards () {
    const options = this.options.twittercards
    const nodes = []

    // meta[name="twitter:card"]
    nodes.push({
      tag: 'meta',
      attrs: {
        name: 'twitter:card',
        content: options.card || 'summary_large_image'
      }
    })

    // meta[name="twitter:title]
    if (this._title) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          name: 'twitter:title',
          content: this._title
        }
      })
    }

    // meta[name="twitter:description"]
    if (this.data.description) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          name: 'twitter:description',
          content: this.data.description
        }
      })
    }

    // meta[name="twitter:url"]
    if (this._url) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          name: 'twitter:url',
          content: this._url
        }
      })
    }

    // meta[name="twitter:image"]
    if (this.data.image && this.data.image.length > 0) {
      this.data.image.forEach(img => {
        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: img.url
          }
        })
      })
    }

    // meta[name="twitter:player"]
    if (this.data.video && this.data.video.length > 0) {
      this.data.video.forEach(video => {
        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            name: 'twitter:player',
            content: video.embedUrl
          }
        })
      })
    }

    return nodes
  }

  get data () {
    let data = this.rawData

    if (!data['@type']) {
      throw getError(errors.isInvalid)
    }

    switch (data['@type']) {
      case 'BlogPosting':
        data = Object.assign(data, {
          // Add properties
        })
        break

      default:
        data = Object.assign(data, {
          // Add properties
        })
    }

    if (data.image) {
      data.image = [].concat(data.image)
        .map(img => {
          if (typeof img === 'string') {
            img = {
              '@type': 'ImageObject',
              url: img
            }
          }
          return img
        })
    }

    if (data.video) {
      data.video = [].concat(data.video)
        .filter(video => {
          if (!video.contentUrl && !video.embedUrl) return
          return true
        })
    }

    data = Object.assign(data, {
      // Add common properties
    })

    return data
  }

  get rawData () {
    let rawData

    try {
      rawData = require(resolve(this.options.root, this.src))
    } catch (e) {
      throw getError(errors.notFound, this.src)
    }

    return rawData
  }
}

function getError () {
  const msg = util.format.apply(util, arguments)
  return new Error(`[posthtml-jsonld] ${msg}`)
}
