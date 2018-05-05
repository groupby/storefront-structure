import { alias, tag, utils, Tag } from '@storefront/core';
import Button from '../button';
import Select from '../select';

@alias('customSelect')
@tag('gb-custom-select', require('./index.html'), require('./index.css'))
class CustomSelect {

  $select: Select.Props;
  refs: { toggle: Button };
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
    }
  };
  isActive: boolean = false;

  onUpdated() {
    if (this.isActive) {
      utils.WINDOW().document.addEventListener('click', this.onClickDeactivate);
    } else {
      utils.WINDOW().document.removeEventListener('click', this.onClickDeactivate);
    }
  }

  onUnmount() {
    utils.WINDOW().document.removeEventListener('click', this.onClickDeactivate);
  }

  onHoverActivate(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.hover && !this.isActive) {
      this.update({ isActive: true });
    }
  }

  onHoverDeactivate(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (!this.props.hover && !this.isActive) {
      this.update();
    }
  }

  onClickDeactivate = (event: MouseEvent & Tag.Event) => {
    event.preventUpdate = true;
    if (!this.props.hover && event.target !== this.refs.toggle.refs.button) {
      this.update({ isActive: false });
    }
  }

  onClickToggleActive = (event: MouseEvent & Tag.Event) => {
    event.preventUpdate = true;
    if (!this.props.hover) {
      this.update({ isActive: !this.isActive });
    }
  }
}

interface CustomSelect extends Tag<CustomSelect.Props, CustomSelect.State> { }
namespace CustomSelect {
  export interface Props extends Tag.Props {
    hover: boolean;
  }

  export interface State {
    selected(): Select.Option;
    onSelect(event: MouseEvent & { item: { i: number } }): void;
  }
}

export default CustomSelect;
