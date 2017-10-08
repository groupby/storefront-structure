import { tag, utils, Tag } from '@storefront/core';

import './track/track';

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {};

  // props: Carousel.Props = <any>{

  // };

  // state: Carousel.State = <any>{
  //   spec: {
  //     left: 300
  //   },
  //   initialPositions: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 0 }]

  // };
  currentSlide: number = 0;
  moveNext = () => {
    // TODO: handle circular
    this.currentSlide = this.currentSlide + 1;

  }

  // this.imageClass = 'slide fade active';

  // updateCurrentSlide = () => {
  //   if (this.state.currentSlide > 3) {
  //     this.state.currentSlide = 0;
  //     return;
  //   }
  //   this.state.currentSlide += 1;
  //   console.log('do I get a state', this.state.spec);
  // }

  // getImagePositions() {
  //   let currentSlidePosition = { x: 0, y: 0 };
  // }

  // generateStyle(images: Image[]) {
  //   images.map((image) => {
  //     const style = {
  //       opacity: 1,
  //       WebkitTransform: 'translate3d(' + this.state.spec.left + 'px, 0px, 0px)',
  //       transform: 'translate3d(' + this.state.spec.left + 'px, 0px, 0px)',
  //       transition: '',
  //       WebkitTransition: '',
  //       msTransform: 'translateX(' + this.state.spec.left + 'px)',
  //     };
  //     return style;
  //   });
  // }

  // moveNext = () => {
  //   this.updateCurrentSlide();
  //   console.log('ccc', this.state.currentSlide);
  // }
}

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props extends Tag.Props {
  }

  export interface State {
    images: Image[];
    currentSlide: number;
    spec: {
      left: number
    };
    initialPositions: object[];
  }
}

export type Image = { url: string };

export default Carousel;