import { tag, Tag } from '@storefront/core';
import Carousel from '../carousel';

@tag('gb-list-item', '<yield/>')
class CarouselItem {

  $carousel: Carousel.Props;
  itemAlias: string;
  indexAlias: string;
  item: any;
  i: number;

  init() {
    this.expose(this.itemAlias = this.$carousel.itemAlias, this.item);
    this.expose(this.indexAlias = this.$carousel.indexAlias, this.i);
    this.unexpose('carousel');
  }

  onUpdate() {
    this.updateAlias(this.itemAlias, this.item);
    this.updateAlias(this.indexAlias, this.i);
  }
}

interface CarouselItem extends Tag { }

export default CarouselItem;
