import { alias, tag, Events, ProductTransformer, Selectors, Tag, transform } from '@storefront/core';
import { DEFAULT_AREA } from '../../../../../flux-capacitor/dist/core/reducers/data/area';

const DEFAULT_VALUE = 1;

@alias('quantitySelector')
@tag('gb-quantity-selector', require('./index.html'))
class QuantitySelector {
  state: QuantitySelector.State = {
    value: DEFAULT_VALUE
  };

  init() {
    // fix: this event no longer fires
    this.flux.on(Events.URL_UPDATED, () => this.set({ value: DEFAULT_VALUE }))
  }

  onMount() {
    this.flux.emit('quantitySelector:change_quantity', this.state.value);
  }

  quantityHandler = (event: MouseEvent | TouchEvent) => {
    if (this.props.onchange) {
      this.props.onchange(<any>event);
    } else {
      this.set({ value: Number(event.target['value'] )});
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
    value: number;
  }

  export interface State {
    value: number;
  }

  export interface Product {
    sku: string;
    productId: string;
    quantity: number;
    title: string;
    metadata: object[];
    collection: string;
    price: string;
  }
}


export default QuantitySelector;