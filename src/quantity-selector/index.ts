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
    this.getOptions(this.props.quantity);
  }
  
  onMount() {
    this.flux.emit('selector:update', this.state.options[this.state.selected].value);
  }
  
  getOptions = (quantity: number) => {
    let options = [];
    let i;
    for (i = 0; i < quantity; i++) {
      let el = {};
      const value = i + 1;
      el = { value };
      el['label'] = value.toString();
      el['selected'] = (i === this.state.selected ? true : false);
      options.push(el);
    }
    this.state.options = options;
  }

  onSelect = (event: MouseEvent & Tag.Event) => {
    this.set({ selected: event });
    this.setSelected();
  }

  setSelected = () => {
    this.state.options.forEach((el, i) => {
      el['selected'] = (i === this.state.selected ? true : false);
    });

    this.flux.emit('selector:update', this.state.options[this.state.selected].value);
  }

}

interface QuantitySelector extends Tag<QuantitySelector.Props> { }
namespace QuantitySelector {
  export interface Props extends Tag.Props {
    onSelect: (event: MouseEvent & Tag.Event) => void;
    product: any;
    quantity: number;
  }
}

export default QuantitySelector;