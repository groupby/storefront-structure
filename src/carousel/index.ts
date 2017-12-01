import { tag, utils, Tag } from '@storefront/core';

export const DEFAULT_ITEM_ALIAS = 'slide';
export const DEFAULT_INDEX_ALIAS = 'index';

const MIN_SWIPE_DISTANCE = 20;
const MOVE_NEXT_UPWARD_MAX_ANGLE = 45;
const MOVE_NEXT_DOWNWARD_MAX_ANGLE = 315;
const MOVE_PREVIOUS_UPWARD_MIN_ANGLE = 135;
const MOVE_PREVIOUS_DOWNWARD_MAX_ANGLE = 225;

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {
    wrapper: HTMLDivElement,
    track: HTMLDivElement
  };

  props: Carousel.Props = {
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    items: [],
    itemAlias: DEFAULT_ITEM_ALIAS,
    indexAlias: DEFAULT_INDEX_ALIAS
  };

  state: Carousel.State = {
    currentSlide: 0,
    transitioning: false,
    items: [],
  };
  animationEndCallback: NodeJS.Timer = null;

  init() {
    this.expose('carousel', this.props);
  }

  onMount() {
    utils.WINDOW().addEventListener('resize', this.update);
  }

  onUpdate() {
    this.state.items = this.cloneItems();
  }

  onUnmount() {
    utils.WINDOW().removeEventListener('resize', this.update);
  }

  moveNext = () => this.slideHandler(this.state.currentSlide + this.props.slidesToScroll);

  movePrevious = () => this.slideHandler(this.state.currentSlide - this.props.slidesToScroll);

  cloneItems = () => {
    const numCloned = this.props.slidesToShow * 2 - 1;
    const slideCount = this.props.items.length;

    const prior = this.props.items
      .slice(-numCloned)
      .map((data, index) => ({ ...data, 'data-index': index - slideCount }));

    this.props.items.forEach((data, index) => (data['data-index'] = index));

    const posterior = this.props.items
      .slice(0, numCloned)
      .map((data) => ({ ...data }));

    return [...prior, ...this.props.items, ...posterior];
  }

  slideHandler = (slide: number) => {
    const { items: { length: slideCount }, speed } = this.props;
    const from = this.state.currentSlide;
    const onEdge = slide >= slideCount || slide <= 0;

    // don't need to consider on edge if speed is 0;
    if (speed === 0) {
      this.resetCurrentSlideNum(from, slide, slideCount);
      return;
    }

    if (!(this.state.transitioning && onEdge)) {
      this.refs.track.addEventListener('transitionend', this.disableTransition, false);
      // make the transition
      this.set({ currentSlide: slide, transitioning: true });

      if (onEdge) {
        // reset to non-cloned slide
        // tslint:disable-next-line:max-line-length
        this.animationEndCallback = setTimeout(() => this.resetToRealSlide(from, slide, slideCount), speed);
      }
    }
  }

  resetToRealSlide = (from: number, to: number, length: number) => {
    this.set({ transitioning: false });
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
        transition,
        '-webkit-transition': transition,
        '-ms-transition': transition
      };
    } else {
      return this.getStaticTrackStyle();
    }
  }

  getStaticTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const { items: { length: slideCount }, slidesToShow } = this.props;
    // based on total count of products after cloning
    const trackWidth = (slideCount + 4 * slidesToShow - 2) * slideWidth;
    const offset = Carousel.calculatePosition(this.state.currentSlide, slideWidth, slidesToShow);
    const transform = `translateX(-${offset}px)`;

    return {
      width: `${trackWidth}px`,
      transform,
      '-webkit-transform': transform,
      '-ms-transform': transform
    };
  }

  getSlideWidth = () => this.refs.wrapper.offsetWidth / this.props.slidesToShow;

  onTouchStart = (e: TouchEvent & Carousel.Event) => {
    this.set({ touchObject: { startX: e.touches[0].pageX, startY: e.touches[0].pageY } });

    e.target.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (e: TouchEvent & Carousel.Event) => {
    const curX = e.changedTouches[0].pageX;
    const curY = e.changedTouches[0].pageY;
    const swipeNext = Carousel.shouldSwipeToNext({ ...this.state.touchObject }, curX, curY);

    // swipe distance needs to be more than 20
    if (Math.abs(curX - this.state.touchObject.startX) > MIN_SWIPE_DISTANCE && typeof swipeNext === 'boolean') {
      swipeNext ? this.moveNext() : this.movePrevious();
    }

    e.target.removeEventListener('touchstart', this.onTouchStart);
    e.target.removeEventListener('touchend', this.onTouchEnd);
  }

  static calculatePosition = (currentSlide: number, moveDistance: number, slidesToShow: number): number =>
    // when it first loads, offset the length of cloned items at the begining
    (currentSlide + slidesToShow * 2 - 1) * moveDistance

  static shouldSwipeToNext = ({ startX, startY }: Carousel.TouchObject, curX: number, curY: number): boolean => {
    let swipeAngle = Math.round(Math.atan2(startY - curY, startX - curX) * 180 / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 + swipeAngle;
    }

    // swipeAngle between 45 and 135, between 225 and 315 is ignored;
    // tslint:disable-next-line:max-line-length
    if ((swipeAngle <= MOVE_NEXT_UPWARD_MAX_ANGLE && swipeAngle >= 0) || (swipeAngle <= 360 && swipeAngle >= MOVE_NEXT_DOWNWARD_MAX_ANGLE)) {
      return true;
    } else if (swipeAngle >= MOVE_PREVIOUS_UPWARD_MIN_ANGLE && swipeAngle <= MOVE_PREVIOUS_DOWNWARD_MAX_ANGLE) {
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
    slidesToShow: number;
    slidesToScroll: number;
    items: any[];
    itemAlias?: string;
    indexAlias?: string;
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