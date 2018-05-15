import { tag, Tag } from '@storefront/core';
import Carousel from '../carousel';

export const DEFAULT_ITEM_ALIAS = 'slide';
export const DEFAULT_INDEX_ALIAS = 'index';

@tag('gb-carousel-slide', '<yield/>')
class CarouselSlide {
  slide: any;
  index: number;
  props: CarouselSlide.Props = {
    itemAlias: DEFAULT_ITEM_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS,
  };

  init() {
    this.provide(this.props.itemAlias, (_, { slide }) => slide);
    this.provide(this.props.indexAlias, (_, { index }) => index);
  }

  onBeforeMount() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    this.state = { ...this.state, slide: this.slide, index: this.index };
  }
}

interface CarouselSlide extends Tag<CarouselSlide.Props, CarouselSlide.State> {}

namespace CarouselSlide {
  export interface Props {
    itemAlias?: string;
    indexAlias?: string;
  }

  export interface State {
    slide: any;
    index: number;
  }
}

export default CarouselSlide;
