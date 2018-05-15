import { tag, Tag } from '@storefront/core';
import Select from '../select';

export const DEFAULT_OPTION_ALIAS = 'option';
export const DEFAULT_INDEX_ALIAS = 'i';

@tag('gb-select-option', '<yield/>')
class SelectOption {
  root: HTMLOptionElement;
  option: Select.Option;
  i: number;
  props: SelectOption.Props = {
    optionAlias: DEFAULT_OPTION_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS,
  };

  init() {
    this.provide(this.props.optionAlias, (_, { option }) => option);
    this.provide(this.props.indexAlias, (_, { index }) => index);
  }

  onBeforeMount() {
    this.updateState();
  }

  onMount() {
    this.updateContent();
  }

  onUpdate() {
    this.updateContent();
    this.updateState();
  }

  updateState() {
    this.state = { ...this.state, option: this.option, index: this.i };
  }

  updateContent() {
    const textContent = this.root.textContent;
    if (textContent !== this.root.label) {
      this.root.label = textContent;
    }
  }
}

interface SelectOption extends Tag<SelectOption.Props, SelectOption.State> {}

namespace SelectOption {
  export interface Props {
    optionAlias: string;
    indexAlias: string;
  }

  export interface State {
    option: Select.Option;
    index: number;
  }
}

export default SelectOption;
