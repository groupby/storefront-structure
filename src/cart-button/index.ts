import { tag, Actions, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  refs: { button: HTMLButtonElement };
  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    let { itemCount } = this.state;
    itemCount = itemCount ? this.state.itemCount + 1 : 1;
    this.set({ itemCount });
    console.log('cart')
    // tslint:disable-next-line:max-line-length
    if (itemCount === 1) {
      // this.flux.emit(Events.CREATE_CART);
      // this.flux.emit(Events.ADD_TO_CART);
      // this.dispatch(Actions.CREATE_CART);
      console.log('you cant see me')
    } else {
      // this.flux.emit(Events.ADD_TO_CART);
      console.log('you cant see me')
    }
  }
}

interface CartButton extends Tag<CartButton.Props> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
  }
}

export default CartButton;