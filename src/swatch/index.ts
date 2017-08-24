import { tag, Tag } from '@storefront/core';

@tag('gb-swatch', require('./index.html'))
class Swatch {

  init() {
    this.expose('swatch', this.props);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }
}

interface Swatch extends Tag<Swatch.Props> { }
namespace Swatch {
  export interface Props extends Tag.Props {
    items?: any[];
    onClick: (event: MouseEvent & Tag.Event) => void;
  }
}

export default Swatch;
