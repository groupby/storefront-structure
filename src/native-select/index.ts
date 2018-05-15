import { tag, Tag } from '@storefront/core';
import Select from '../select';

@tag('gb-native-select', require('./index.html'))
class NativeSelect {
  refs: { selector: HTMLSelectElement };

  onUpdated() {
    const selectedIndex = this.props.options.findIndex((option) => option.selected);
    if (this.refs.selector.selectedIndex !== selectedIndex) {
      this.refs.selector.selectedIndex = selectedIndex;
    }
  }

  updateSelection(event: Event & { target: HTMLSelectElement; preventUpdate: boolean }) {
    event.preventUpdate = true;
    if (this.props.onSelect) {
      this.props.onSelect(event.target.selectedIndex);
    }
  }
}

interface NativeSelect extends Tag<Select.Props> {}

export default NativeSelect;
