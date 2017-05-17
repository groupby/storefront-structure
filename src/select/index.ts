import { view, Component } from '@storefront/core';

@view('gb-select', require('./index.html'), [
  { name: 'options', default: [] },
  { name: 'optionAlias', default: 'option' },
  { name: 'indexAlias', default: 'i' },
  { name: 'onSelect', default: () => ({}) }
])
class Select extends Component {

  constructor() {
    super();
    this.exposeProps('select');
  }
}

namespace Select {
  export interface Props {
    options: Option[];
    optionAlias: string;
    indexAlias: string;
    onSelect(index: number): void;
  }

  export interface Option {
    label: string;
    value: string;
    selected?: boolean;
  }
}

export default Select;
