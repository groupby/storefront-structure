import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

const TAX_RATE = 0.05;

@alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  // TODO: create product card tag for cart
  state: CartRow.State = {
    cartContent: [],
    removeItem: (product) => this.actions.removeItem(product)
  }

  init() {
    this.flux.on(Events.CART_ITEMS_UPDATED, this.update);
  }

  getCartContent = () => this.select(Selectors.cart).content.items;

  getTotalPrice = () => this.select(Selectors.cart).content.generatedTotalPrice.toFixed(2);
}

interface CartRow extends Tag<CartRow.Props, CartRow.State> { }
namespace CartRow {
  export interface Props extends Tag.Props {
    products: any[];
  }

  export interface State {
    cartContent: any[];
    removeItem: (product: any) => void
  }
}

export default CartRow;