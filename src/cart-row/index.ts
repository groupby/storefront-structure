import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

@alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  state: CartRow.State = {
    cartContent: [],
    removeItem: (product) => this.actions.removeItem(product)
  };

  init() {
    this.flux.on(Events.CART_ITEMS_UPDATED, this.update);
  }

  getCartContent = () => this.select(Selectors.cart).content.items;

  getTotalPrice = () => this.select(Selectors.cart).content.generatedTotalPrice.toFixed(2);
}

interface CartRow extends Tag<CartRow.Props, CartRow.State> { }
namespace CartRow {
  export interface Props extends Tag.Props {
  }

  export interface State {
    cartContent: any[];
    removeItem: (product: Product) => void;
  }

  export interface Product {
    sku: string;
    productId: string;
    quantity: number;
    title: string;
    metadata: Metadata[];
    collection: string;
    price: number;
  }

  export interface Metadata {
    key: string;
    value: string;
  }
}

export default CartRow;