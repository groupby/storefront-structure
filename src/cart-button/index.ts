import { tag, Actions, Events, Selectors, Tag } from '@storefront/core';

@tag('gb-cart-button', require('./index.html'))
class CartButton {

  refs: { button: HTMLButtonElement };

  constructor() {
    const cart = this.select(Selectors.cart);
    const details = this.select(Selectors.details);
    this.state = { ...this.state, cart };
  }

  init() {
    this.services.cart.register(this);
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
    this.flux.emit(Events.ADD_TO_CART);
    // this.flux.store.dispatch(this.flux.actions.addToCart(item));
    // this.set({ ...this.state, cart: { ...this.state.cart, items: [...this.state.cart.items, ...item] } });
  }

}

interface CartButton extends Tag<CartButton.Props> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
  }

  export interface State {
    cart: any;
  }
}

export default CartButton;