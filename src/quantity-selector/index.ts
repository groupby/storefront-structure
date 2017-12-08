import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

@alias('selector')
@tag('gb-quantity-selector', require('./index.html'))
class QuantitySelector {

  constructor() {
    const cart = this.select(Selectors.cart);
    const details = this.select(Selectors.details);
    this.state = { ...this.state, cart, selected: 0 };
  }

  init() {
    console.log('e', this.props.quantity);
    this.getOptions(this.props.quantity);
  }

  getOptions = (quantity: number) => {
    let options = new Array(quantity);

    options.forEach((el, i: number) => {
      const value = (i + 1).toString();
      el.lable = value;
      el = { value };
      el.select = false;
    });

    this.set({ options }) ;
  }

}

interface QuantitySelector extends Tag<QuantitySelector.Props> { }
namespace QuantitySelector {
  export interface Props extends Tag.Props {
    onClick: (event: MouseEvent & Tag.Event) => void;
    product: any;
    quantity: number;
  }
}

export default QuantitySelector;