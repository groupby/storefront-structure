import { tag, Tag } from '@storefront/core';

@tag('gb-button', require('./index.html'))
class Button {

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}

interface Button extends Tag<Button.Props> { }
namespace Button {
  export interface Props {
    onClick: () => void;
  }
}

export default Button;
