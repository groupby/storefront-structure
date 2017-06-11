import { tag, Tag } from '@storefront/core';
import Select from '../select';

@tag('gb-native-select', require('./index.html'))
class NativeSelect {

  $select: Select.Props;
  refs: { selector: HTMLSelectElement };

  onUpdated() {
    const selectedIndex = this.$select.options.findIndex((option) => option.selected);
    if (this.refs.selector.selectedIndex !== selectedIndex) {
      this.refs.selector.selectedIndex = selectedIndex;
    }
  }

  updateSelection(event: Event & { target: HTMLSelectElement, preventUpdate: boolean }) {
    event.preventUpdate = true;
    if (this.$select.onSelect) {
      this.$select.onSelect(event.target.selectedIndex);
    }
  }
}

interface NativeSelect extends Tag { }

export default NativeSelect;
