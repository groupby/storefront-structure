import { tag, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  init() {
    // todo: keep this for service in core
    // this.services.cart.register(this);
    this.state.quantity = 1;
    this.flux.on('selector:change_quantity', this.updateQuantity);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.addItem(this.props.product, this.state.quantity);
  }

  updateQuantity = (quantity: number) => {
    this.set({ quantity });
  }

  addItem = (item: any, quantity: number) => {
    this.flux.store.dispatch(this.flux.actions.addToCart(item, quantity));
  }

}

interface CartButton extends Tag<CartButton.Props> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
  }
}

export default CartButton;