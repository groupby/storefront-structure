import { alias, tag, Events, Selectors, Tag } from '@storefront/core';

const INITIAL_INDEX = 0;

@alias('selector')
@tag('gb-quantity-selector', require('./index.html'))
class QuantitySelector {

  state: QuantitySelector.State = {
    selected: INITIAL_INDEX,
    options: []
  };

  init() {
    this.getOptions(this.props.quantity);

    // args for this event is a url link
    this.flux.on(Events.URL_UPDATED, this.reset);
  }

  onMount() {
    this.flux.emit('selector:change_quantity', this.state.options[this.state.selected].value);
  }

  getOptions = (quantity: number) => {
    let options = [];
    for (let i = 0; i < quantity; i++) {
      const value = i + 1;

      options.push({ value, label: value.toString(), selected: (i === this.state.selected) });
    }
    this.state.options = options;
  }

  setSelected = (target: number = INITIAL_INDEX) => {
    this.state.selected = target;
    this.state.options.forEach((el: Option, i) => {
      el.selected = (i === this.state.selected);
    });

    this.flux.emit('selector:change_quantity', this.state.options[this.state.selected].value);
  }

  reset = () => {
    this.setSelected();
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
    options: any[];
  }
}

interface Option {
  value: number;
  label: string;
  selected: boolean;
}

export default QuantitySelector;