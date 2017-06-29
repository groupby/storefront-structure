import { tag, Tag } from '@storefront/core';
import List from '../list';

@tag('gb-carousel', require('./index.html'))
class Carousel {

  refs: {
    list: List,
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
    // TODO
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
