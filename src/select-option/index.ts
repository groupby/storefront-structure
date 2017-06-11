import { tag, Tag } from '@storefront/core';
import Select from '../select';

@tag('gb-select-option', '<yield/>')
class SelectOption {

  root: HTMLOptionElement;
  $select: Select.Props;
  optionAlias: string;
  indexAlias: string;
  option: Select.Option;
  i: number;

  init() {
    this.expose(this.optionAlias = this.$select.optionAlias, this.option);
    this.expose(this.indexAlias = this.$select.indexAlias, this.i);
  }

  onMount() {
    this.updateContent();
  }

  onUpdate() {
    this.updateAlias(this.optionAlias, this.option);
    this.updateAlias(this.indexAlias, this.i);
    this.updateContent();
  }

  updateContent() {
    const textContent = this.root.textContent;
    if (textContent !== this.root.label) {
      this.root.label = textContent;
    }
  }
}

interface SelectOption extends Tag { }

export default SelectOption;
