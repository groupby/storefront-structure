import { tag, Actions, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  refs: { button: HTMLButtonElement };
  constructor() {
    const cart = this.select(Selectors.cart);
    this.state = { ...this.state, cart };
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    let { itemCount } = this.state;
    itemCount = itemCount ? this.state.itemCount + 1 : 1;
    this.set({ itemCount });
    console.log('clicked')
    this.flux.emit(Events.CREATE_CART);
    if (itemCount === 1) {
      // this.flux.emit(Events.CREATE_CART);
      // this.flux.emit(Events.ADD_TO_CART);
    } else {
      // this.flux.emit(Events.ADD_TO_CART);
    }
  }

  updateCart(item: string) {
    this.set({ cart: { ...this.state.cart, item }});
    this.flux.emit('cart:update', this.state.cart);
  }

  createCart(item: string) {
    this.set({ cart: { ...this.state.cart, item }});
    this.flux.emit('cart:create', this.state.cart);
  }

}

interface CartButton extends Tag<CartButton.Props> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
  }
}

export default CartButton;