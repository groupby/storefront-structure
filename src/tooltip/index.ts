import { tag, Tag } from '@storefront/core';

@tag('gb-tooltip', require('./index.html'), require('./index.css'))
class Tooltip {

  props: Tooltip.Props = {
    orientation: 'above'
  };
}

interface Tooltip extends Tag<Tooltip.Props> { }
namespace Tooltip {
  export interface Props extends Tag.Props {
    orientation: 'left' | 'right' | 'above' | 'below';
  }
}

export default Tooltip;
