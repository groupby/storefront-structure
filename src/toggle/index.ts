import { tag, utils, Tag } from '@storefront/core';

@tag('gb-toggle', require('./index.html'), require('./index.css'))
class Toggle {

  props: Toggle.Props = {
    checked: false
  };
  refs: {
    input: HTMLInputElement,
  };

  onMount() {
    this.refs.input.checked = this.props.checked;
  }

  onClick(event: MouseEvent & Tag.Event) {
    event.preventUpdate = true;
    if (this.props.onToggle) {
      this.props.onToggle(this.refs.input.checked);
    }
  }
}

interface Toggle extends Tag<Toggle.Props> { }
namespace Toggle {
  export interface Props {
    checked?: boolean;
    onToggle?: (checked: boolean) => void;
  }
}

export default Toggle;
