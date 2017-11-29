import { alias, tag, utils, Tag } from '@storefront/core';

const MIN_SWIPE_DISTANCE = 20;

@alias('carousel')
@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {
    wrapper: HTMLDivElement,
    track: HTMLDivElement
  };
  props: Carousel.Props = {
    speed: 0,
    slidestoshow: 1,
    slidestoscroll: 1,
    items: []
  };
  state: Carousel.State = {
    currentSlide: 0,
    transitioning: false,
    items: []
  };
  animationEndCallback: NodeJS.Timer | null = null;

  onMount() {
    utils.WINDOW().addEventListener('resize', this.update);
  }

  onUpdate() {
    this.state.items = this.cloneItems();
  }

  onUnmount() {
    utils.WINDOW().removeEventListener('resize', this.update);
  }

  moveNext = () => this.slideHandler(this.state.currentSlide + this.props.slidestoscroll);

  movePrevious = () => this.slideHandler(this.state.currentSlide - this.props.slidestoscroll);

  cloneItems = () => {
    const numCloned = this.props.slidestoshow * 2 - 1;
    const length = this.props.items.length;

    const prior = this.props.items
      .slice(-numCloned)
      .map((data, index) => ({ ...data, 'data-index': index - length }));

    this.props.items.forEach((data, index) => (data['data-index'] = index));

    const posterior = this.props.items
      .slice(0, numCloned)
      .map((data, index) => ({ ...data }));

    return prior.concat(this.props.items).concat(posterior);
  }

  slideHandler = (slide: number) => {
    const { speed } = this.props;
    const from = this.state.currentSlide;
    const length = this.props.items.length;
    const onEdge = slide >= length || slide <= 0;

    // don't need to consider on edge if speed is 0;
    if (!speed) {
      this.resetCurrentSlideNum(from, slide, length);
      return;
    }

    if (!(this.state.transitioning && onEdge)) {
      // make the transition
      this.set({ currentSlide: slide, transitioning: true });

      if (onEdge) {
        // reset to non-cloned slide
        // tslint:disable-next-line:max-line-length
        this.animationEndCallback = setTimeout(() => this.resetToRealSlide(from, slide, length), speed);
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
    const currentSlide = from < to ? to % length : (to % length + length) % length;
    this.set({ currentSlide });
  }

  disableTransition = () => {
    this.refs.track.removeEventListener('transitionend', this.disableTransition, false);
    this.set({ transitioning: false });
  }

  trackStyle = () => {
    const { speed } = this.props;
    if (this.state.transitioning && speed) {
      const transition = `${speed}ms ease`;
      return {
        ...this.getStaticTrackStyle(),
        '-webkit-transition': transition,
        transition,
        '-ms-transition': transition
      };
    } else {
      return this.getStaticTrackStyle();
    }
  }

  getStaticTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const slideCount = this.props.items.length;
    const slidestoshow = this.props.slidestoshow;
    const trackWidth = (slideCount + 4 * slidestoshow - 2) * slideWidth;
    const pos = Carousel.calculatePosition(this.state.currentSlide, slideWidth, slidestoshow);
    const transform = `translateX(-${pos}px)`;

    return {
      width: `${trackWidth}px`,
      transform,
      '-webkit-transform': transform,
      '-ms-transform': transform
    };
  }

  getSlideWidth = () => this.refs.wrapper.offsetWidth / this.props.slidestoshow;

  onTouchStart = (e: TouchEvent & Carousel.Event) => {
    this.state.touchObject = {
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY
    };

    e.target.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (e: TouchEvent & Carousel.Event) => {
    const curX = e.changedTouches[0].pageX;
    const curY = e.changedTouches[0].pageY;
    const swipeNext = Carousel.isSwipeToNext({ ...this.state.touchObject }, curX, curY);

    // swipe distance needs to be more than 20
    if (Math.abs(curX - this.state.touchObject.startX) > MIN_SWIPE_DISTANCE && typeof swipeNext === 'boolean') {
      swipeNext ? this.moveNext() : this.movePrevious();
    }

    e.target.removeEventListener('touchstart', this.onTouchStart);
    e.target.removeEventListener('touchend', this.onTouchEnd);
  }

  static calculatePosition = (currentSlide: number, moveDistance: number, slidestoshow: number): number =>
    (currentSlide + slidestoshow * 2 - 1) * moveDistance

  static isSwipeToNext = (touchObj: Carousel.TouchObject, curX: number, curY: number): boolean => {
    const xDist = touchObj.startX - curX;
    const yDist = touchObj.startY - curY;

    const r = Math.atan2(yDist, xDist);

    let swipeAngle = Math.round(r * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    // swipeAngle between 45 and 135, between 225 and 315 is ignored;
    if ((swipeAngle <= 45 && swipeAngle >= 0) || (swipeAngle <= 360 && swipeAngle >= 315)) {
      return true;
    } else if (swipeAngle >= 135 && swipeAngle <= 225) {
      return false;
    } else {
      return null;
    }
  }
}

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props extends Tag.Props {
    speed: number;
    slidestoshow: number;
    slidestoscroll: number;
    items: any[];
  }

  export interface State {
    currentSlide: number;
    transitioning: boolean;
    touchObject?: TouchObject;
    items: any[];
  }

  export interface TouchObject {
    startX: number;
    startY: number;
  }

  export type Event = Tag.Event & { target: Element };
}

export default Carousel;