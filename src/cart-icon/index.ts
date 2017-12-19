import { alias, tag, Events, Selectors, Tag } from '@storefront/core';
import { totalmem } from 'os';

@alias('quantity')
@tag('gb-cart-icon', require('./index.html'), require('./index.css'))
class CartIcon {
  state: CartIcon.State = {
    totalQuantity: 0
  };

  constructor() {
    const { totalQuantity } = this.select(Selectors.cart).content;
    console.log('t', totalQuantity)
    this.state = { ...this.state, totalQuantity };
  }

  init() {
    this.flux.on(Events.CART_QUANTITY_UPDATED, this.updateQuantity);
  }

  updateQuantity = () => {
    const { totalQuantity } = this.select(Selectors.cart).content;
    this.set({ totalQuantity });
  }

}

interface CartIcon extends Tag<CartIcon.Props, CartIcon.State> { }
namespace CartIcon {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
  }

  export interface State {
    totalQuantity: number;
  }
}

export default CartIcon;