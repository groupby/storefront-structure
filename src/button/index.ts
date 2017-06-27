import { tag, Tag } from '@storefront/core';

@tag('gb-button', require('./index.html'))
class Button {

  refs: { button: HTMLButtonElement };
  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }
}

interface Button extends Tag<Button.Props> { }
namespace Button {
  export interface Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
  }
}

export default Button;
