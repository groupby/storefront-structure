import { tag, utils, Tag } from '@storefront/core';
import List from '../list';

@tag('gb-carousel', require('./index.html'))
class Carousel {

  refs: {
    listwrapper: HTMLDivElement,
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
  maxOffset: number = 0;
  pageSize: number = 0;

  onMount() {
    this.calculateAttributes();
  }

  onUpdate() {
    this.calculateAttributes();
  }

  calculateAttributes() {
    const viewportWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.viewport).width);
    const itemWidth = parseFloat(utils.WINDOW().getComputedStyle(this.refs.listwrapper).width) / this.props.items.length;
    this.pageSize = Math.floor(viewportWidth / itemWidth);
    this.maxOffset = Math.max(0, Math.floor((this.props.items.length - 1) / this.pageSize)) * this.pageSize;
  }

  onClickPrev() {
    this.set({ offset: Math.max(0, this.state.offset - this.pageSize) });
  }

  onClickNext() {
    this.set({ offset: Math.min(this.state.offset + this.pageSize, this.maxOffset) });
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
