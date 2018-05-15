import { provide, tag, Tag } from '@storefront/core';

@provide('select', (props) => props)
@tag('gb-select', require('./index.html'))
class Select {
  props: Select.Props = {
    options: [],
  } as Select.Props;

  childProps() {
    return this.props;
  }
}

interface Select extends Tag<Select.Props> {}
namespace Select {
  export interface Props extends Tag.Props {
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
