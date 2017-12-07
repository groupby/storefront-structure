import { tag, Tag } from '@storefront/core';
import Carousel from '../carousel';

@tag('gb-carousel-slide', '<yield/>')
class CarouselSlide {

  $carousel: Carousel.Props;
  itemAlias: string;
  indexAlias: string;
  slide: any;
  index: number;

  init() {
    this.expose(this.itemAlias = this.$carousel.itemAlias, this.slide);
    this.expose(this.indexAlias = this.$carousel.indexAlias, this.index);
    this.unexpose('carousel');
  }

  onUpdate() {
    this.updateAlias(this.itemAlias, this.slide);
    this.updateAlias(this.indexAlias, this.index);
  }
}

interface CarouselSlide extends Tag { }

export default CarouselSlide;
