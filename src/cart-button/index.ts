import { tag, Events, ProductTransformer, Selectors, Tag, TransformUtils } from '@storefront/core';

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
    console.log('aaaa', item)
    const { structure } = this.config.cart;
    const data = TransformUtils.remap(item, <any>structure);
    console.log('zzzz', data);

    this.flux.store.dispatch(this.flux.actions.addToCart(item, quantity));
  }

  quantityHandler = (event: MouseEvent | TouchEvent) => {
    this.set({ quantity: Number(event.target['value']) });
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