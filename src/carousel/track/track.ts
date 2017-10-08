import { alias, tag, Tag } from '@storefront/core';
import classnames from 'classnames';

@tag('gb-carousel-track', require('./track.html'), require('./track.css'))
class Track {

    imageStyle: any = {
        styleOne: {},
        styleTwo: {},
        styleThree: {},
    };

    activeStyle: any = {
        'border-width': '5px',
        'border-style': 'dashed'
    };

    classOne: string = 'slide fade';
    // classTwo: any = {active: true};
    classTwo: string = this.classOne;

    classThree: string = 'slide fade active';

    classNames: any = [this.classOne, this.classTwo, this.classThree];

    // why type can't be string??
    getSlideClasses: any = () => {
        const style = '';
        return style;
    }

    getSlideStyle: object = () => {
        const style = {};
        return style;
    }

    onBeforeMount() {
        console.log('haadsad');
    }
}
namespace Track {
    export interface Props {
    }
    export interface State {
    }
    export interface Event {
    }
}

const getSlideClasses = (spec) => {
    let slickActive;
    let slickCenter;
    let slickCloned;
    let centerOffset;
    let index;

    if (spec.rtl) {
      index = spec.slideCount - 1 - spec.index;
    } else {
      index = spec.index;
    }
    slickCloned = (index < 0) || (index >= spec.slideCount);

    if (spec.centerMode) {
      centerOffset = Math.floor(spec.slidesToShow / 2);
      slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
      if ((index > spec.currentSlide - centerOffset - 1) && (index <= spec.currentSlide + centerOffset)) {
        slickActive = true;
      }
    } else {
      slickActive = (spec.currentSlide <= index) && (index < spec.currentSlide + spec.slidesToShow);
    }
  
    return classnames({
      'slick-slide': true,
      'slick-active': slickActive,
      'slick-center': slickCenter,
      'slick-cloned': slickCloned
    });
  };