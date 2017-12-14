import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

@alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  constructor() {
    this.getCartContent();
  }

  init() {
    // when persist the store on first load, this will fire
    this.flux.on(Events.CART_ITEMS_UPDATED, this.getCartContent);
  }

  getCartContent = () => {
    const cart = this.select(Selectors.cart);
    this.set({ cartContent: cart.content.items });
  }

}

interface CartRow extends Tag<CartRow.Props, CartRow.State> { }
namespace CartRow {
  export interface Props extends Tag.Props {
    products: any[];
  }

  export interface State {
  }
}

export default CartRow;