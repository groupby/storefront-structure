import { tag, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  constructor() {
    const cart = this.select(Selectors.cart);
    this.state = { ...this.state, cart, selected: 0 };
  }

  init() {
    // this.services.cart.register(this);
    this.flux.on(Events.CART_ID_UPDATED, this.registerCartId);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.addItem(this.props.product);
  }

  registerCartId = (cartId: number) => {
    this.set({ ...this.state, cart: { ...this.state.cart, cartId } });
  }

  addItem = (item: any) => {
    this.flux.store.dispatch(this.flux.actions.addToCart(item));
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