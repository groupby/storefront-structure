import { tag, utils, Tag } from '@storefront/core';
const DEFAULT_SLIDES = 1;

const DEFAULT_SETTINGS = {
  fade: true,
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
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
  noTransition: boolean = true;

  onMount() {
    if (this.refs.carouselwrap.addEventListener) {
      utils.WINDOW().addEventListener('resize', this.updateWindow);
    }
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
    this.gotoSlide(this.currentSlide + (this.props.settings.slidesToScroll || 1));
  }

  movePrevious = () => {
    this.gotoSlide(this.currentSlide - (this.props.settings.slidesToScroll || 1));
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

  getUpdatedItems = () => {
    if (this.props.items) {
      const { settings = DEFAULT_SETTINGS } = this.props;

      const infiniteCount = settings.slidesToShow;
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

  gotoSlide = (slide: number) => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const from = this.currentSlide;
    const to = slide;

    // make the transition
    this.currentSlide = slide;

    const threshold = this.props.items.length;
    const rightBound = this.currentSlide + settings.slidesToShow - 1;
    if (rightBound >= threshold || this.currentSlide < 0) {
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

      this.refs.track.addEventListener('transitionend', listener);
    }
  }

  goto = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const { settings = DEFAULT_SETTINGS } = this.props;
    const slide = parseInt((e.target as HTMLElement).getAttribute('data-index-to-go')) * settings.slidesToShow;
    this.gotoSlide(slide);
  }

  getSlideStyle = () => {
    const slideWidth = this.getSlideWidth();
    return {
      width: `${slideWidth}px`,
      outline: 'none',
    };
  }

  getTrackStyle = () => {
    if (!(this.getUpdatedItems() && this.props.items)) {
      return;
    }
    const slideWidth = this.getSlideWidth();
    const slideCount = this.getUpdatedItems().length;
    const { settings = DEFAULT_SETTINGS } = this.props;
    const trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
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
    const leftBound = this.currentSlide;
    const rightBound = this.currentSlide + settings.slidesToShow;
    if (this.noTransition) {
      delete style['transition'];
      delete style['-webkit-transition'];
      this.noTransition = !this.noTransition;
    }
    return style;
  }

  getDots = (): any[] => {
    if (!this.props.items) {
      return;
    }
    const slideCount = this.props.items.length;
    const { settings = DEFAULT_SETTINGS } = this.props;

    const dotCount = Math.ceil((slideCount - settings.slidesToShow) / settings.slidesToScroll + 1);

    return Array(dotCount).fill('dot');
  }

  getDotStyle: {} = (i: number) => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const { slidesToShow } = settings;

    let leftBound = i * settings.slidesToScroll;
    let rightBound = i * settings.slidesToScroll + settings.slidesToShow - 1;

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
    const { settings = DEFAULT_SETTINGS } = this.props;
    const { slidesToShow } = settings;
    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }
  }

  calcPos = (currS: number, moveDistance: number): number => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const { slidesToShow } = settings;
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