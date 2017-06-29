import { tag, Tag } from '@storefront/core';

@tag('gb-carousel', require('./index.html'))
class Carousel {
  props: Carousel.Props = {
    items: [],
    prevIcon: '',
    nextIcon: ''
  };
  state: Carousel.State = {
    index: 0
  };

  onClickPrev(event: MouseEvent & Tag.Event) {
    // TODO
  }

  onClickNext(event: MouseEvent & Tag.Event) {
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
    index: number;
  }
}

export default Carousel;
