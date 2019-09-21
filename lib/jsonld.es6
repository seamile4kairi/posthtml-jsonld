import {
  join,
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
    host: 'http://localhost',
    base: '/',
    parents: [],
    title: false,
    description: false,
    opengraph: false,
    twittercards: false,
    canonical: false,
    alternate: []
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

    options.parents = []
      .concat(options.parents)
      .filter(item => {
        if (typeof item !== 'object') return
        if (!item.url || !item.title) return
        return true
      })
      .map(item => ({
        '@type': 'ListItem',
        item: {
          '@id': item.url,
          name: item.title
        }
      }))

    this.options = options
  }

  get nodes () {
    const nodes = []

    // title
    if (this.options.title && this.title) {
      nodes.push(this.title, '\n')
    }

    // meta[name="description"]
    if (this.options.description && this.description) {
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
    if (this.options.canonical && this.canonical) {
      nodes.push(this.canonical, '\n')
    }

    // link[rel="alternate"]
    if (this.options.alternate.length > 0 && this.alternate) {
      nodes.push(this.alternate, '\n')
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
    if (!this.data.description) return

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
    if (this.data.url) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          property: 'og:url',
          content: this.data.url
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
            content: this.normalizeUrl(img.url, true)
          }
        })
      })
    }

    // meta[property="og:video"]
    if (this.data.video && this.data.video.length > 0) {
      this.data.video.forEach(video => {
        if (!video.contentUrl) return

        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            property: 'og:video',
            content: this.normalizeUrl(video.contentUrl, true)
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
    if (this.data.url) {
      nodes.push('\n', {
        tag: 'meta',
        attrs: {
          name: 'twitter:url',
          content: this.data.url
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
            content: this.normalizeUrl(img.url, true)
          }
        })
      })
    }

    // meta[name="twitter:player"]
    if (this.data.video && this.data.video.length > 0) {
      this.data.video.forEach(video => {
        if (!video.embedUrl) return

        nodes.push('\n', {
          tag: 'meta',
          attrs: {
            name: 'twitter:player',
            content: this.normalizeUrl(video.embedUrl, true)
          }
        })
      })
    }

    return nodes
  }

  get canonical () {
    if (!this.data.url) return

    return {
      tag: 'link',
      attrs: {
        rel: 'canonical',
        href: this.data.url
      }
    }
  }

  get alternate () {
    if (!this.data.url) return

    const options = [].concat(this.options.alternate)
      .filter(opt => typeof opt === 'object')
      .filter(opt => (opt.media || opt.hreflang))
      .filter(opt => (opt.href && typeof opt.href === 'function'))
    const nodes = []

    if (options.length === 0) return

    options.forEach((opt, i) => {
      const attrs = {}

      attrs.rel = 'alternate'
      if (opt.media) attrs.media = opt.media
      if (opt.hreflang) attrs.hreflang = opt.hreflang
      attrs.href = opt.href(this.data.url)

      if (i !== 0) nodes.push('\n')
      nodes.push({
        tag: 'link',
        attrs: attrs
      })
    })

    return nodes
  }

  get data () {
    const data = Object.assign({}, this.rawData)

    if (!data['@type']) {
      throw getError(errors.isInvalid)
    }

    if (data.url) {
      data.url = this.normalizeUrl(data.url)
    }

    const itemList = []
      .concat(this.options.parents, data.itemListElement)
      .filter(item => {
        if (typeof item !== 'object') return
        if (item['@type'] !== 'ListItem') return
        if (!item.item) return
        if (!item.item['@id'] || !item.item.name) return
        return true
      })
      .map((item, i) => {
        item.position = i + 1
        item.item['@id'] = this.normalizeUrl(item.item['@id'])
        return item
      })

    if (itemList.length > 0) {
      data.itemListElement = itemList
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

          img.url = this.normalizeUrl(img.url)

          return img
        })
    }

    if (data.video) {
      data.video = [].concat(data.video)
        .filter(video => (video.contentUrl || video.embedUrl))
        .map(video => {
          if (video.contentUrl) {
            video.contentUrl = this.normalizeUrl(video.contentUrl)
          }
          if (video.embedUrl) {
            video.embedUrl = this.normalizeUrl(video.embedUrl)
          }
          return video
        })
    }

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

  normalizeUrl (str, requireHost = false) {
    if (typeof str !== 'string') return str
    if (/^(https?:)?\/\//.test(str)) return str

    const host = this.options.host.replace(/\/$/, '')
    const base = join('/', this.options.base)
    const path = /^[~@]\//.test(str)
      ? join(base, str.replace(/^[~@]\//, ''))
      : join('/', str)

    if (requireHost || /^@\//.test(str)) return host + path
    if (/^~\//.test(str)) return path
    return path
  }
}

function getError () {
  const msg = util.format.apply(util, arguments)
  return new Error(`[posthtml-jsonld] ${msg}`)
}
