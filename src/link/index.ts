import { tag, Tag } from '@storefront/core';

@tag('gb-link', require('./index.html'))
class Link {

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}

interface Link extends Tag<Link.Props> { }
namespace Link {
  export interface Props extends Tag.Props {
    onClick(): void;
  }
}

export default Link;
