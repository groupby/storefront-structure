import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SETTINGS = {
  speed: 0,
  slidesToShow: 1,
  slidesToScroll: 1
};

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {
    wrapper: HTMLDivElement,
    track: HTMLDivElement
  };

  props: Carousel.Props = <any>{ setting: {}, items: [] };
  animationEndCallback: NodeJS.Timer | null = null;

  state: Carousel.State = {
    settings: {
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1
    },
    currentSlide: 0,
    transitioning: false,
    products: []
  };

  onMount() {
    utils.WINDOW().addEventListener('resize', this.updateWindow);
  }

  onUpdate() {
    // this.state.products = this.cloneItems();
    this.state.settings = {
      speed: this.props.settings.speed || 0,
      slidesToShow: this.props.settings.slidesToShow || 1,
      slidesToScroll: this.props.settings.slidesToScroll || 1
    };
  }

  onUnMount() {
    utils.WINDOW().removeEventListener('resize', this.updateWindow);
  }

  updateWindow = () => {
    this.update();
  }

  moveNext = () => {
    this.slideHandler(this.state.currentSlide + this.state.settings.slidesToScroll);
  }

  movePrevious = () => {
    this.slideHandler(this.state.currentSlide - this.state.settings.slidesToScroll);
  }

  onTouchStart = (e: TouchEvent & Carousel.Event) => {
    e.stopPropagation();

    const posX = e.touches[0].pageX;
    const posY = e.touches[0].pageY;

    // this.set({ touchObject: { startX: posX, startY: posY } });
    this.state.touchObject = {
      startX: posX,
      startY: posY
    };

    this.refs.wrapper.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (e: TouchEvent & Carousel.Event) => {
    const curX = e.changedTouches[0].pageX;
    const curY = e.changedTouches[0].pageY;
    // swipe distance needs to be more than 20
    if (Math.abs(curX - this.state.touchObject.startX) > 20) {
      isSwipeToNext({ ...this.state.touchObject, curX, curY }) ? this.moveNext() : this.movePrevious();
    }

    this.refs.wrapper.removeEventListener('touchstart', this.onTouchStart);
    this.refs.wrapper.removeEventListener('touchend', this.onTouchEnd);
  }

  cloneItems = () => {
    if (!this.props.items) {
      return [];
    }

    const slidesToShow = this.state.settings.slidesToShow;
    const numCloned = slidesToShow * 2 - 1;
    const length = this.props.items.length;
    const prior = this.props.items
      .slice(-numCloned)
      .map((d, i) => ({ ...d, 'data-index': i - length }));
    const posterior = this.props.items
      .slice(0, numCloned)
      .map((d, i) => ({ ...d, 'data-index': i }));
    this.props.items.forEach((d, i) => (d['data-index'] = i));

    return prior.concat(this.props.items).concat(posterior);
  }

  slideHandler = (slide: number) => {
    const slidesToShow = this.state.settings.slidesToShow;
    const from = this.state.currentSlide;
    const length = this.props.items.length;
    const onEdge = slide >= length || slide <= 0;

    // turn off transition if speed is 0;
    if (!this.state.settings.speed) {
      this.resetCurrentSlideNum(from, slide, length);
      return;
    }

    if (!(this.state.transitioning && onEdge)) {
      // make the transition
      this.state.currentSlide = slide;
      this.state.transitioning = true;
      this.update();

      if (onEdge) {
        // reset to non-cloned slide
        // tslint:disable-next-line:max-line-length
        this.animationEndCallback = setTimeout(() => this.resetToRealSlide(from, slide, length), this.state.settings.speed);
      } else {
        this.refs.track.addEventListener('transitionend', this.disableTransition, false);
      }
    }
  }

  resetToRealSlide = (from: number, to: number, length: number) => {
    this.state.transitioning = false;
    this.resetCurrentSlideNum(from, to, length);
    this.animationEndCallback = null;
  }

  resetCurrentSlideNum = (from: number, to: number, length: number) => {
    if (from < to) {
      this.state.currentSlide = to % length;
    } else {
      this.state.currentSlide = (to % length + length) % length;
    }
    this.update();
  }

  disableTransition = () => {
    this.refs.track.removeEventListener('transitionend', this.disableTransition);
    this.state.transitioning = false;
    this.update();
  }

  dotHandler = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const slidesToShow =
      this.state.settings.slidesToShow;
    const slide =
      parseInt((e.target as HTMLElement).getAttribute('data-index-to-go')) *
      slidesToShow;
    this.slideHandler(slide);
  }

  getStaticTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const slideCount = this.props.items.length;
    const slidesToShow = this.state.settings.slidesToShow;
    const trackWidth = (slideCount + 4 * slidesToShow - 2) * slideWidth;

    const pos = this.calculatePosition(this.state.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;
    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm
    };

    return { width: `${trackWidth}px`, ...transformStyles };
  }

  trackStyle = () => {
    if (!this.props.items) {
      return;
    }

    let transitionStyles = {};
    if (this.state.transitioning && this.state.settings.speed) {
      const speed = this.state.settings.speed;
      const transition = speed + 'ms ' + 'ease';
      transitionStyles = {
        '-webkit-transition': transition,
        transition,
        '-ms-transition': transition
      };
    }

    return { ...this.getStaticTrackStyle(), ...transitionStyles };
  }

  getDots = () => {
    if (!this.props.items || this.props.items.length < 1) {
      return [];
    }
    const slideCount = this.props.items.length;
    const slidesToShow = this.state.settings.slidesToShow;
    const slidesToScroll = this.state.settings.slidesToScroll;

    const dotCount = Math.ceil(
      (slideCount - slidesToScroll) / slidesToScroll + 1
    );

    return Array(dotCount).fill('dot');
  }

  dotClassName = (i: number) => {
    const slidesToShow = this.state.settings.slidesToShow;
    const slidesToScroll = this.state.settings.slidesToScroll;

    let leftBound = i * slidesToScroll;
    let rightBound = i * slidesToScroll + slidesToShow - 1;

    if (
      this.state.currentSlide === leftBound &&
      this.state.currentSlide <= rightBound
    ) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.refs.wrapper.offsetWidth;

    if (visibleWidth) {
      return visibleWidth / this.state.settings.slidesToShow;
    }
  }

  // tslint:disable-next-line:max-line-length
  calculatePosition = (currentSlide: number, moveDistance: number): number => (currentSlide + this.state.settings.slidesToShow * 2 - 1) * moveDistance;
}

const isSwipeToNext = (touchObj: Carousel.TouchObject): boolean => {
  const xDist = touchObj.startX - touchObj.curX;
  const yDist = touchObj.startY - touchObj.curY;

  const r = Math.atan2(yDist, xDist);

  let swipeAngle = Math.round(r * 180 / Math.PI);

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  // swipeAngle between 45 and 135, between 225 and 315 is ignored;
  if (
    (swipeAngle <= 45 && swipeAngle >= 0) ||
    (swipeAngle <= 360 && swipeAngle >= 315)
  ) {
    return true;
  } else if (swipeAngle >= 135 && swipeAngle <= 225) {
    return false;
  }
};

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props extends Tag.Props {
    settings?: {
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
    };
    items: any[];
  }

  export interface State {
    settings: {
      speed: number;
      slidesToShow: number;
      slidesToScroll: number;
    };
    currentSlide: number;
    transitioning: boolean;
    touchObject?: TouchObject;
    // tODO: change type
    products: any;
  }

  export interface TouchObject {
    startX: number;
    startY: number;
    curX?: number;
    curY?: number;
  }

  export type Event = Tag.Event & { target: Element };
}

export default Carousel;
export { isSwipeToNext };
