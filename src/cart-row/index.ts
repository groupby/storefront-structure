import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

const TAX_RATE = 0.05;

@alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  constructor() {
    this.getCartContent();
    this.state = {...this.state, taxRate: TAX_RATE, removeItem: this.removeItem }
  }

  init() {
    // when persist the store on first load, this will fire
    this.flux.on(Events.CART_ITEMS_UPDATED, this.getCartContent);
  }

  getCartContent = () => {
    const cart = this.select(Selectors.cart);
    this.set({ cartContent: cart.content.items, totalPrice: cart.content.generatedTotalPrice });
  }

  removeItem = (product: any) => {
    console.log('roemove', product)
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