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

  setSelected = (target: number = INITIAL_INDEX) => {
    this.state.selected = target;
    this.state.options.forEach((el, i) => {
      el['selected'] = (i === this.state.selected ? true : false);
    });

    this.flux.emit('selector:update', this.state.options[this.state.selected].value);
  }

  reset = () => {
    this.setSelected();
  }

}

interface QuantitySelector extends Tag<QuantitySelector.Props> { }
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

export default QuantitySelector;