import {
  resolve,
} from 'path';
import util from 'util';

const errors = {
  hasNoSrc: `<jsonld> has no [src] attribute.`,
  notFound: `Required JSON was not found.`,
  isInvalid: `Required JSON may be invalid. Check the file in: https://search.google.com/structured-data/testing-tool/`,
};

export default (options = {}) => tree => {
  options = Object.assign({
    root: './',
    meta: false,
    opengraph: false,
    twittercards: false,
  }, options)

  tree = tree.match({
    tag: 'jsonld',
  }, node => {
    if (!node.attrs || !node.attrs.src) {
      throw getError(errors.hasNoSrc);
    }

    const data = new JsonLd(node.attrs.src, options);

    return {
      tag: false,
      content: data.nodes,
    };
  });

  return tree;
};

class JsonLd {
  constructor (src, options) {
    this.src = src;
    this.options = options;
  }

  get nodes () {
    let nodes = [];

    nodes = nodes.concat(this.script);

    return nodes;
  }

  get script () {
    return {
      tag: 'script',
      type: 'application/json+ld',
      content: [
        JSON.stringify(this.data),
      ]
    };
  }

  get meta () {
    // Add the process to generate <meta> trees
  }

  get opengraph () {
    // Add the process to generate meta[name="og:*"] trees
  }

  get twittercards () {
    // Add the process to generate meta[name="twitter:*"] trees
  }

  get data () {
    let data = this.rawData;

    if (!data['@type']) {
      throw getError(errors.isInvalid);
    }

    switch (data['@type']) {
      case 'Article':
        data = Object.assign(data, {
          // Add properties
        });

      // Add another cases

      default:
        data = Object.assign(data, {
          // Add properties
        });
    }

    return data;
  }

  get rawData () {
    let rawData;

    try {
      rawData = require(resolve(this.options.root, this.src));
    } catch (e) {
      throw getError(errors.notFound);
    }

    return rawData;
  }
}

function getError () {
  const msg = util.format.apply(util, args);
  return new Error(`[posthtml-jsonld] ${msg}`);
}
