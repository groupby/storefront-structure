import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

@alias('quantity')
@tag('gb-cart-icon', require('./index.html'), require('./index.css'))
class CartIcon {
  state: CartIcon.State = {
    quantity: 0
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