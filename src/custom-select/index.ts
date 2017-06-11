import { alias, tag, utils, Tag } from '@storefront/core';
import Select from '../select';

@alias('customSelect')
@tag('gb-custom-select', require('./index.html'), require('./index.css'))
class CustomSelect {

  $select: Select.Props;
  refs: { toggle: HTMLButtonElement };
  props: CustomSelect.Props = {
    hover: false
  };
  state: CustomSelect.State = {
    selected: () => this.$select.options.find((option) => option.selected),
    onSelect: (event) => {
      if (this.$select.onSelect) {
        this.$select.onSelect(event.item.i);
      }
      this.update({ isActive: false });
      this.refs.toggle.blur();
    }
  };
  isActive: boolean = false;

  onHoverActivate(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.hover && !this.isActive) {
      this.update({ isActive: true });
    }
  }

  onClickDeactivate(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (!this.props.hover && !this.isActive) {
      this.update();
    }
  }

  onLostFocus = (event: FocusEvent & Tag.Event) => {
    event.preventUpdate = true;
    if (!this.props.hover) {
      this.isActive = false;
    }
  }

  onClickActivate = () => {
    if (!this.props.hover) {
      const isActive = this.isActive;
      this.update({ isActive: !isActive });
      if (isActive) {
        this.refs.toggle.blur();
      } else {
        this.refs.toggle.focus();
      }
    }
  }
}

interface CustomSelect extends Tag<CustomSelect.Props, CustomSelect.State> { }
namespace CustomSelect {
  export interface Props {
    hover: boolean;
  }

  export interface State {
    selected(): Select.Option;
    onSelect(event: MouseEvent & { item: { i: number } }): void;
  }
}

export default CustomSelect;
