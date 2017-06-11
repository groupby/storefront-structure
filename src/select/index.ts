import { tag, Tag } from '@storefront/core';

@tag('gb-select', require('./index.html'))
class Select {

  props: Select.Props = {
    options: [],
    optionAlias: 'option',
    indexAlias: 'i'
  };

  init() {
    this.expose('select', this.props);
  }
}

interface Select extends Tag<Select.Props> { }
namespace Select {
  export interface Props {
    options: Option[];
    optionAlias: string;
    indexAlias: string;
    onSelect?(index: number): void;
  }

  export interface Option {
    label: string;
    value?: string;
    selected?: boolean;
  }
}

export default Select;
