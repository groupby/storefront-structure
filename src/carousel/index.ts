import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SLIDES = 1;

const DEFAULT_SETTINGS = {
  fade: true,
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0
};

let UPDATE_ONCE = true;

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {
    carouselwrap: HTMLElement,
    track: HTMLDivElement,
    dots: HTMLDivElement,
    slide: HTMLDivElement
  };

  props: Carousel.Props = <any>{ settings: DEFAULT_SETTINGS };

  touchObject: {
    startX: number,
    startY: number,
    curX: number,
    curY: number
  };

  currentSlide: number = 0;
  dots: string[];
  secret: boolean = true;

  moveNext = () => {
    this.getCurrentSlideOnNext();
  }

  movePrevious = () => {
    this.getCurrentSlideOnPrev();
  }

  onTouchStart = (event: TouchEvent & Carousel.Event) => {
    event.preventDefault();
    event.stopPropagation();

    // IE browsers have different properties on event
    const posX = event.touches[0].pageX;
    const posY = event.touches[0].pageY;

    this.touchObject = {
      startX: posX,
      startY: posY,
      curX: posX,
      curY: posY
    };
    this.refs.carouselwrap.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (event: TouchEvent & Carousel.Event) => {

    this.touchObject.curX = event.changedTouches[0].pageX;
    this.touchObject.curY = event.changedTouches[0].pageY;

    this.swipeSlides(this.touchObject);
    this.refs.carouselwrap.removeEventListener('touchstart', this.onTouchStart);
    this.refs.carouselwrap.removeEventListener('touchend', this.onTouchEnd);
  }

  moveSlide = () => {
    return;
  }

  onMount() {
    // onMount or beforeMount?
    if (this.refs.carouselwrap.addEventListener) {
      // utils.WINDOW().addEventListener('resize', this.update);
    }
  }

  onUpdate() {
    console.log('curr slide', this.currentSlide);
  }

  onUnMount() {
    if (window.addEventListener) {
      // window.removeEventListener('resize', this.update);
    }
  }

  getUpdatedItems = () => {
    if (this.props.items) {
      const infiniteCount = this.props.settings.slidesToShow;
      let itemCount = this.props.items.length;
      let preCloneSlides = [];
      let postCloneSlides = [];

      this.props.items.forEach((data, index) => {
        data['data-index'] = index;

        if (index >= (itemCount - infiniteCount)) {
          let key = -(itemCount - index);
          preCloneSlides.push(Object.assign(utils.clone(data), {
            'data-index': key,
          }));
        } else if (index < infiniteCount) {
          
          let key = itemCount + index;
          postCloneSlides.push(Object.assign(utils.clone(data), {
            'data-index': key,
          }));
        }
      });
      return  preCloneSlides.concat(this.props.items, postCloneSlides);
    } else {
      return [];
    }
  }

  getCurrentSlideOnNext = () => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    this.currentSlide += settings.slidesToScroll;

    const listener = () => {
      this.currentSlide = this.currentSlide - slideCount;
      this.refs.track.removeEventListener('transitionend', listener);
      this.secret = true;
      this.update();
    };

    const slideCount = this.props.items.length;
    const rightBound = this.currentSlide + settings.slidesToShow;
    if (rightBound > slideCount) {
      this.refs.track.addEventListener('transitionend', listener);  
    }   
  }

  getCurrentSlideOnPrev = () => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const slideCount = this.props.items.length;

    this.currentSlide -= settings.slidesToScroll;
    
    const listener = () => {
      this.currentSlide = this.currentSlide + slideCount;
      this.refs.track.removeEventListener('transitionend', listener);
      this.secret = true;
      this.update();
    };

    if (this.currentSlide < 0) {
      this.refs.track.addEventListener('transitionend', listener);  
    }
  }

  getSlideStyle = () => {
    const slideWidth = this.getSlideWidth();
    return {
      width: `${slideWidth}px`,
      outline: 'none',
    };
  }

  getTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const { settings } = this.props;
    const slideCount = this.getUpdatedItems().length;
    let trackWidth;

    if (settings.slidesToShow) {
      trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
    } else {
      trackWidth = (slideCount + 2) * slideWidth;
    }
    const pos = this.calcPos(this.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;

    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm,
    };

    const transition = settings.speed + 'ms ' + 'ease';
    const transitionStyles = settings.fade === true ? {
      '-webkit-transition': transition,
      transition
    } : {};

    const style = Object.assign({}, {
      width: `${trackWidth}px`,
    },
      transformStyles,
      transitionStyles);

    const threshold = this.props.items.length;
    const { slidesToShow } = this.props.settings;
    const leftBound = this.currentSlide;
    const rightBound = this.currentSlide + slidesToShow;
    if (this.secret) {
      delete style['transition'];
      delete style['-webkit-transition'];
      this.secret = !this.secret;
    }  
    return style;
  }

  getDots: any = () => {
    const slideCount = this.props.items.length;
    const { slidesToShow } = this.props.settings;
    const { slidesToScroll } = this.props.settings;

    const dotCount = Math.ceil((slideCount - slidesToShow) / slidesToScroll + 1);
     
    return Array(dotCount).fill('dot');
  }

  getDotStyle: any = (i) => {
    const { slidesToScroll } = this.props.settings;
    const { slidesToShow } = this.props.settings;

    let leftBound = i * slidesToScroll;
    let rightBound = i * slidesToScroll + slidesToShow - 1;

    if (this.currentSlide >= leftBound && this.currentSlide <= rightBound) {
      return { 'background-color': 'black' }
    } else {
      return {}
    }
  }

  getSlidesToShow = () => this.props.settings.slidesToShow;

  swipeSlides = (touchObj: { startX: number, startY: number, curX: number, curY: number }) => {
    const direction: string = calSwipeDirection(touchObj);

    if (direction) {
      direction === 'left' ? this.moveNext() : this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.refs.carouselwrap.offsetWidth;
    const { settings = DEFAULT_SETTINGS } = this.props;
    const { slidesToShow } = settings
    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }
  }

  calcPos = (currS: number, moveDistance: number): number => {
    const { slidesToShow } = this.props.settings;
    return (currS + slidesToShow) * moveDistance;
  };
}


const calSwipeDirection = (touchObj: { startX: number, startY: number, curX: number, curY: number }): string => {
  const xDist = touchObj.startX - touchObj.curX;
  const yDist = touchObj.startY - touchObj.curY;
  const r = Math.atan2(yDist, xDist);

  let swipeAngle = Math.round(r * 180 / Math.PI);

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  // swipeAngle between 45 and 135, between 225 and 315 is ignored;
  if (swipeAngle <= 45 && swipeAngle > 0 || swipeAngle <= 360 && swipeAngle >= 315) {
    return 'left';
  }
  if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
    return ('right');
  }
};

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props extends Tag.Props {
    settings: {
      slidesToShow?: number;
      slidesToScroll?: number;
      speed?: number;
      fade?: boolean;
    };
    items: any[];
  }

  export interface State {
  }

  export type Event = Tag.Event & { target: Element };
}

export type Image = { url: string };

export default Carousel;