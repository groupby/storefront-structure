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
    this.flux.on(Events.CART_ITEMS_UPDATED, this.update);
  }

  getCartContent = () => {
    return this.select(Selectors.cart).content.items;
  }

  onUpdate() {
    console.log('update', this.select(Selectors.cart).content.generatedTotalPrice)
  }

  getTotalPrice = () => {
    const cart = this.select(Selectors.cart);
    if (cart && cart.cotent && cart.content.generatedTotalPrice) {
      console.log('should update price', cart.content.generatedTotalPrice)
      return cart.content.generatedTotalPrice.toFixed(2)
    } else {
      return '0';
    }
  };

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