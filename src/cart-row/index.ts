import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

const TAX_RATE = 0.05;

@alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  // TODO: create product card tag for cart
  constructor() {
    this.getCartContent();
    this.state = {...this.state, taxRate: TAX_RATE, removeItem: this.removeItem }
  }

  init() {
    // fix or not fix:when persist the store on first load, this will fire
    this.flux.on(Events.CART_ITEMS_UPDATED, this.update);
  }

  getCartContent = () => {
    return this.select(Selectors.cart).content.items;
  }

  getTotalPrice = () => this.select(Selectors.cart).content.generatedTotalPrice.toFixed(2);

  removeItem = (product: any) => {
    this.actions.removeItem(product);
  }

}

interface CartRow extends Tag<CartRow.Props, CartRow.State> { }
namespace CartRow {
  export interface Props extends Tag.Props {
    products: any[];
  }

  export interface State {
    cartContent: any[];
    totalPrice: number;
    taxRate: number;
    removeItem: (product: any) => void
  }
}

export default CartRow;