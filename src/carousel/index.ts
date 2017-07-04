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

  calculateAttributes() {
    const viewportWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.viewport).width);
    const itemWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.list).width) / this.props.items.length;
    const pageSize = Math.floor(viewportWidth / itemWidth);

    this.set({ pageSize });
  }

  onClickPrev() {
    const viewportWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.viewport).width);
    const itemWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.list).width) / this.props.items.length;
    const offset = Math.max(0, this.state.offset - Math.floor(viewportWidth / itemWidth));
    this.set({ offset });
  }

  onClickNext() {
    const viewportWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.viewport).width);
    const itemWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.list).width) / this.props.items.length;
    const pageSize = Math.floor(viewportWidth / itemWidth);
    const maxOffset = Math.max(0, Math.floor((this.props.items.length - 1) / pageSize)) * pageSize;
    const offset = Math.min(this.state.offset + pageSize, maxOffset);
    this.set({ offset });
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
