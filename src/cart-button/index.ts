import { tag, Events, Selectors, Tag } from '@storefront/core';

const DEFAULT_VALUE = 1;

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  state: CartButton.State = {
    quantity: DEFAULT_VALUE
  }

  init() {
    // todo: keep this for service in core
    // this.services.cart.register(this);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.addItem(this.props.product, Number(this.state.quantity));
  }

  addItem = (item: any, quantity: number) => {
    console.log('add quanitty', quantity)
    this.flux.store.dispatch(this.flux.actions.addToCart(item, quantity));
  }

  quantityHandler = (event: MouseEvent | TouchEvent) => {
    console.log('are u getting this')
    this.set({ quantity: event.target['value'] });
  }

}

interface CartButton extends Tag<CartButton.Props, CartButton.State> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
  }

  export interface State {
    quantity: number;
  }
}

export default CartButton;