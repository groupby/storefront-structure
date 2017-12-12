import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

@alias('quantity')
@tag('gb-cart-icon', require('./index.html'), require('./index.css'))
class CartIcon {
  state: CartIcon.State = {
    quantity: 0
  };

  constructor() {
    const cart = this.select(Selectors.cart);
    this.state = { ...this.state, quantity: cart.content.quantity };
  }

  init() {
    this.flux.on(Events.CART_UPDATED, this.updateQuantity);
  }

  updateQuantity = () => {
    const cart = this.select(Selectors.cart);
    this.set({ quantity: cart.content.quantity });
  }

}

interface CartIcon extends Tag<CartIcon.Props> { }
namespace CartIcon {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
  }

  export interface State {
    quantity: number;
  }
}

export default CartIcon;