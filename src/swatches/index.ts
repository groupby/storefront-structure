import { alias, tag, Tag } from '@storefront/core';

@alias('swatches')
@tag('gb-swatches', require('./index.html'))
class Swatches {

  state: Swatches.State = {
    onClick: (event) => {
      if (this.props.onClick) {
        this.props.onClick(event.item.i);
      }
    },
    onActivate: (event) => {
      event.preventUpdate = true;
      if ( this.props.onChange) {
        this.props.onChange(event.item.i, true);
      }
    },
    onDeactivate: (event) => {
      event.preventUpdate = true;
      if (this.props.onChange) {
        this.props.onChange(event.item.i, false);
      }
    }
  };
}

interface Swatches extends Tag<Swatches.Props, Swatches.State> { }
namespace Swatches {
  export interface Props extends Tag.Props {
    onClick(index: number): void;
    onChange(index: number, isActive: boolean): void;
  }

  export interface State {
    onClick(e: Event): void;
    onActivate(event: Event): void;
    onDeactivate(event: Event): void;
  }

  export interface Event extends Tag.Event {
    item: {
      i: number;
    };
  }
}

export default Swatches;
