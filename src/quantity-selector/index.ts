import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

const INITIAL_INDEX = 0;

@alias('quantitySelector')
@tag('gb-quantity-selector', require('./index.html'))
class QuantitySelector {

  state: QuantitySelector.State = {
    selected: INITIAL_INDEX,
    value: 1
  };

  init() {

    // args for this event is a url link
    this.flux.on(Events.URL_UPDATED, () => this.setSelected);
  }

  onMount() {
    this.flux.emit('selector:change_quantity', this.state.value);
  }

  setSelected = (target: number = INITIAL_INDEX) => {
    // this.state.selected = target;
    // this.state.options.forEach((el: Option, i) => {
    //   el.selected = (i === this.state.selected);
    // });
    console.log('here')

    this.flux.emit('selector:change_quantity', this.state.value);
  }
}

interface QuantitySelector extends Tag<QuantitySelector.Props, QuantitySelector.State> { }
namespace QuantitySelector {
  export interface Props extends Tag.Props {
    onSelect: (event: MouseEvent & Tag.Event) => void;
    product: any;
    quantity: number;
  }

  export interface State {
    selected: number;
    value: number;
  }
}

interface Option {
  value: number;
  label: string;
  selected: boolean;
}

export default QuantitySelector;