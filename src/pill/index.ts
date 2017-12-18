import { tag, Tag } from '@storefront/core';

@tag('gb-pill', require('./index.html'))
class Pill {
  props: Pill.Props = {
    selected: false,
  };
  refs: { button: HTMLButtonElement };

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  onClose(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClose) {
      this.props.onClose(event);
    }
  }
}

interface Pill extends Tag<Pill.Props> { }
namespace Pill {
  export interface Props extends Tag.Props {
    selected: boolean;
    onClose?: (event: MouseEvent & Tag.Event) => void;
    onClick?: (event: MouseEvent & Tag.Event) => void;
  }
}

export default Pill;
