import { tag, Tag } from '@storefront/core';

@tag('gb-carousel', require('./index.html'))
class Carousel {

  refs: {};
}

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props {
  }
}

export default Carousel;
