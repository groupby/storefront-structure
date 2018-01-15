import { tag, Events, ProductTransformer, Selectors, Tag, TransformUtils } from '@storefront/core';

const DEFAULT_VALUE = 1;

@tag('gb-cart-button', require('./index.html'))
class CartButton {
  state: CartButton.State = {
    quantity: DEFAULT_VALUE
  }

  init() {
    // keep this for service in core
    // this.services.cart.register(this);
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.addItem(this.props.product, this.state.quantity);
  }

  addItem = (item: CartButton.RawProduct, quantity: number) => {
    const transformed = this.productTransformer(item, quantity);

    this.flux.store.dispatch(this.flux.actions.addToCart(transformed));
  }

  quantityHandler = (event: MouseEvent | TouchEvent) => {
    this.set({ quantity: Number(event.target['value']) });
  }

  productTransformer = (item: CartButton.RawProduct, quantity: number) => {
    const { structure } = this.config.cart;
    const data = TransformUtils.remap(item, <any>structure);
    data['collection'] = this.config.collection;
    data['metadata'] = [{ key: 'image', value: data['image'] }];
    data['quantity'] = quantity;
    delete data['image'];

    return data;
  };
}

interface CartButton extends Tag<CartButton.Props, CartButton.State> { }
namespace CartButton {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: RawProduct;
  }

  export interface State {
    quantity: number;
  }
  
  export interface RawProduct {
    data: object;
    variants: object[];
  }
}


export default CartButton;