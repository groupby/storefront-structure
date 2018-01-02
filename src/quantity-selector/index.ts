import { alias, tag, Events, Selectors, Tag } from '@storefront/core';
import { DEFAULT_AREA } from '../../../../../flux-capacitor/dist/core/reducers/data/area';

const DEFAULT_VALUE = 1;

@alias('quantitySelector')
@tag('gb-quantity-selector', require('./index.html'))
class QuantitySelector {


  state: QuantitySelector.State = {
    value: DEFAULT_VALUE
  };

  init() {
    this.flux.on(Events.URL_UPDATED, () => this.set({ value: DEFAULT_VALUE }))
  }

  onMount() {
    this.flux.emit('quantitySelector:change_quantity', this.state.value);
  }

  setSelected = (event: MouseEvent | TouchEvent) => {
    this.set({ value: event.target['value'] });
    this.flux.emit('quantitySelector:change_quantity', this.state.value);
  }

  quantityHandler = (event: MouseEvent | TouchEvent) => {
    console.log('change')
    if (this.props.onchange) {
      this.props.onchange(<any>event);
    } else {
      this.set({ value: event.target['value'] });
      this.actions.itemQuantityChanged(this.props.product, Number(event.target['value']));
    }
  }
}

interface QuantitySelector extends Tag<QuantitySelector.Props, QuantitySelector.State> { }
namespace QuantitySelector {
  export interface Props extends Tag.Props {
    onchange: (event: MouseEvent & Tag.Event) => void;
    product: any;
    quantity: number;
  }

  export interface State {
    value: number;
  }
}

interface Option {
  value: number;
  label: string;
  selected: boolean;
}

export default QuantitySelector;