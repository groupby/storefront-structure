import { view, Component } from '@storefront/core';
import Select from '../select';

@view('gb-select-option', '<yield/>')
class SelectOption extends Component {
  root: HTMLOptionElement;
  $select: Select.Props;
  option: Select.Option;
  i: number;

  onBeforeMount() {
    this.expose(this.$select.optionAlias, this.option);
    this.expose(this.$select.indexAlias, this.i);
    this.root.value = this.option.value;
    this.root.label = this.option.label;
    this.root.selected = this.option.selected;
  }
}

export default SelectOption;
