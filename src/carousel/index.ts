import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SETTINGS = {
  transition: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
};

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
  noTransition: boolean = true;

  onMount() {
    if (this.refs.carouselwrap.addEventListener) {
      utils.WINDOW().addEventListener('resize', this.updateWindow);
    }
  }

  onUpdate() {
    console.log('ccc', this.currentSlide)
  }

  onUnMount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.updateWindow);
    }
  }

  updateWindow = () => {
    this.noTransition = true;
    this.update();
  }

  moveNext = () => {
    this.goToSlide(this.currentSlide + (this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll));
  }

  movePrevious = () => {
    this.goToSlide(this.currentSlide - (this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll));
  }

  onTouchStart = (e: TouchEvent & Carousel.Event) => {
    e.preventDefault();
    e.stopPropagation();

    // ie browsers have different properties on event
    const posX = e.touches[0].pageX;
    const posY = e.touches[0].pageY;

    this.touchObject = {
      startX: posX,
      startY: posY,
      curX: posX,
      curY: posY
    };
    this.refs.carouselwrap.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (e: TouchEvent & Carousel.Event) => {

    this.touchObject.curX = e.changedTouches[0].pageX;
    this.touchObject.curY = e.changedTouches[0].pageY;

    this.swipeSlides(this.touchObject);
    this.refs.carouselwrap.removeEventListener('touchstart', this.onTouchStart);
    this.refs.carouselwrap.removeEventListener('touchend', this.onTouchEnd);
  }

  cloneItems = () => {
    if (!this.props.items) {
      return;
    }

    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;

    let itemCount = this.props.items.length;
    let preCloneSlides = [];
    let postCloneSlides = [];

    this.props.items.forEach((data, index) => {
      data['data-index'] = index;

      if (index >= (itemCount - slidesToShow)) {
        let key = -(itemCount - index);
        preCloneSlides.push({...data,
          'data-index': key,
        });
      } else if (index < slidesToShow) {

        let key = itemCount + index;
        postCloneSlides.push({...data,
          'data-index': key,
        });
      }
    });

    return preCloneSlides.concat(this.props.items, postCloneSlides);
  }

  goToSlide = (slide: number) => {
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const from = this.currentSlide;
    const to = slide;

    // make the transition
    this.currentSlide = slide;

    const threshold = this.props.items.length;
    const rightBound = this.currentSlide + slidesToShow - 1;

    const listener = () => {
      if (from < to) {
        this.currentSlide = this.currentSlide - threshold;
      } else {
        this.currentSlide = this.currentSlide + threshold;
      }
      this.refs.track.removeEventListener('transitionend', listener);
      this.noTransition = true;
      this.update();
    };

    if (rightBound >= threshold || this.currentSlide < 0) {
      this.refs.track.addEventListener('transitionend', listener);
    }
  }

  createListener = (from: number, to: number, threshold: number) => {
    return () => {
      if (from < to) {
        this.currentSlide = this.currentSlide - threshold;
      } else {
        this.currentSlide = this.currentSlide + threshold;
      }
      // this.refs.track.removeEventListener('transitionend', listener);
      this.noTransition = true;
      this.update();
    };
  }

  goToDot = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;

    const slide = parseInt((e.target as HTMLElement).getAttribute('data-index-to-go')) * slidesToShow;
    this.goToSlide(slide);
  }

  getSlideStyle = () => {
    const slideWidth = this.getSlideWidth();
    return {
      width: `${slideWidth}px`,
      outline: 'none',
    };
  }

  getTrackStyle = () => {
    if (!(this.cloneItems() && this.props.items)) {
      return;
    }
    const slideWidth = this.getSlideWidth();
    const slideCount = this.cloneItems().length;
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const transition = this.props.settings.transition || DEFAULT_SETTINGS.transition;
    const speed = this.props.settings.speed || DEFAULT_SETTINGS.speed;

    const trackWidth = (slideCount + 2 * slidesToShow) * slideWidth;
    const pos = this.calcPos(this.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;

    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm,
    };

    const trsition = speed + 'ms ' + 'ease';
    const transitionStyles = transition === true ? {
      '-webkit-transition': trsition,
      transition: trsition
    } : {};

    const style = Object.assign({}, {
      width: `${trackWidth}px`,
    },
      transformStyles,
      transitionStyles);

    const threshold = this.props.items.length;
    const leftBound = this.currentSlide;
    const rightBound = this.currentSlide + slidesToShow;
    if (this.noTransition) {
      delete style['transition'];
      delete style['-webkit-transition'];
      this.noTransition = !this.noTransition;
    }
    return style;
  }

  getDots = () => {
    if (!this.props.items) {
      return;
    }
    const slideCount = this.props.items.length;
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const slidesToScroll = this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll;

    const dotCount = Math.ceil((slideCount - slidesToShow) / slidesToScroll + 1);

    return Array(dotCount).fill('dot');
  }

  getDotStyle = (i: number) => {
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const slidesToScroll = this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll;

    let leftBound = i * slidesToScroll;
    let rightBound = i * slidesToScroll + slidesToShow - 1;

    if (this.currentSlide >= leftBound && this.currentSlide <= rightBound) {
      return { 'background-color': 'black' };
    } else {
      return {};
    }
  }

  swipeSlides = (touchObj: { startX: number, startY: number, curX: number, curY: number }) => {
    const direction: string = calSwipeDirection(touchObj);

    if (direction) {
      direction === 'left' ? this.moveNext() : this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.refs.carouselwrap.offsetWidth;
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;

    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }
  }

  calcPos = (currS: number, moveDistance: number): number => {
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;

    return (currS + slidesToShow) * moveDistance;
  }
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
      transition?: boolean;
    };
    items: any[];
  }

  export interface State {
  }

  export type Event = Tag.Event & { target: Element };
}

export type Image = { url: string };

export default Carousel;