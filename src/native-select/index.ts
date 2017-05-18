import { view, Component } from '@storefront/core';
import Select from '../select';

@view('gb-native-select', require('./index.html'))
class NativeSelect {
  $select: Select.Props;

  updateSelection(event: { target: HTMLSelectElement, preventUpdate: boolean }) {
    event.preventUpdate = true;
    if (this.$select.onSelect) {
      this.$select.onSelect(event.target.selectedIndex);
    }
  }
}

export default NativeSelect;
