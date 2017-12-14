import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

// @alias('cartRow')
@tag('gb-cart-row', require('./index.html'), require('./index.css'))
class CartRow {
  
}

interface CartRow extends Tag<CartRow.Props, CartRow.State> { }
namespace CartRow {
  export interface Props extends Tag.Props {
  }

  export interface State {
  }
}

export default CartRow;