import { tag, utils, Tag } from '@storefront/core';
import List from '../list';

@tag('gb-carousel', require('./index.html'))
class Carousel {

  refs: {
    list: HTMLDivElement,
    viewport: HTMLDivElement
  };
  props: Carousel.Props = {
    items: [],
    prevIcon: '',
    nextIcon: ''
  };
  state: Carousel.State = {
    offset: 0
  };

  onClickPrev() {
    const viewportWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.viewport).width);
    const itemWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.list).width) / this.props.items.length;
    const newOffset = Math.max(0, this.state.offset - Math.floor(viewportWidth / itemWidth));
    this.set({ offset: newOffset });
  }

  onClickNext() {
    // TODO
  }
}

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props {
    items?: any[];
    prevIcon?: string;
    nextIcon?: string;
  }

  export interface State {
    offset: number;
  }
}

export default Carousel;
