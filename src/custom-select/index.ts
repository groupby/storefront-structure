import { provide, tag, utils, Tag } from '@storefront/core';
import Button from '../button';
import Select from '../select';

@provide('customSelect')
@tag('gb-custom-select', require('./index.html'), require('./index.css'))
class CustomSelect {
  refs: { toggle: Button };
  props: CustomSelect.Props = {
    hover: false,
  } as CustomSelect.Props;
  state: CustomSelect.State = {
    selected: () => this.props.options.find((option) => option.selected),
    onSelect: (event) => {
      if (this.props.onSelect) {
        this.props.onSelect(event.item.i);
      }
      this.set({ isActive: false });
    },
    isActive: false,
  };

  onUpdated() {
    if (this.state.isActive) {
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
    if (this.props.hover && !this.state.isActive) {
      this.set({ isActive: true });
    }
  }

  onHoverDeactivate(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (!this.props.hover && !this.state.isActive) {
      this.set(true);
    }
  }

  onClickDeactivate = (event: MouseEvent & Tag.Event) => {
    event.preventUpdate = true;
    if (!this.props.hover && event.target !== this.refs.toggle.refs.button) {
      this.set({ isActive: false });
    }
  };

  onClickToggleActive = () => {
    if (!this.props.hover) {
      this.set({ isActive: !this.state.isActive });
    }
  };
}

interface CustomSelect extends Tag<CustomSelect.Props, CustomSelect.State> {}
namespace CustomSelect {
  export interface Props extends Tag.Props, Select.Props {
    hover: boolean;
  }

  export interface State {
    isActive: boolean;
    selected(): Select.Option;
    onSelect(event: MouseEvent & { item: { i: number } }): void;
  }
}

export default CustomSelect;
