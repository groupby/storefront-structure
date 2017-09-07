import { tag, Tag } from '@storefront/core';

@tag('gb-swatch', require('./index.html'))
class Swatch {

  init() {
    this.expose('swatch', this.props);
  }
}

interface Swatch extends Tag<Swatch.Props> { }
namespace Swatch {
  export interface Props extends Tag.Props {
    color: string;
    image: string;
    label: string;
    onClick(index: number): void;
  }
}

export default Swatch;
