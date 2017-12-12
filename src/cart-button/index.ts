import { tag, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  init() {
    // todo: keep this for service in core
    // this.services.cart.register(this);
    this.flux.on('selector:update', this.updateQuantity);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.addItem(this.props.product);
  }

  updateQuantity = (quantity: number) => {
    this.set({ quantity });
  }

  addItem = (item: any) => {
    this.flux.store.dispatch(this.flux.actions.addToCart(item, this.state.quantity));
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