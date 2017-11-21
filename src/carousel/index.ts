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

  props: Carousel.Props = <any>{ settings: DEFAULT_SETTINGS };
  animationEndCallback: NodeJS.Timer | null = null;

  state: Carousel.State = {
    settings: {
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1
    },
    currentSlide: 0,
    transitioning: false,
    touchObject: {
      startX: null,
      startY: null,
      curX: null,
      curY: null
    },
    products: []
  };

  onMount() {
    utils.WINDOW().addEventListener('resize', this.updateWindow);
  }

  onUpdate() {
    this.state.products = this.cloneItems();
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

    this.set({ touchObject: { startX: posX, startY: posY } });
    this.refs.wrapper.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchEnd = (e: TouchEvent & Carousel.Event) => {
    this.state.touchObject.curX = e.changedTouches[0].pageX;
    this.state.touchObject.curY = e.changedTouches[0].pageY;

    // swipe distance needs to be more than 20
    if (Math.abs(this.state.touchObject.curX - this.state.touchObject.startX) > 20) {
      this.swipeSlides(this.state.touchObject);
    }

    this.refs.wrapper.removeEventListener('touchstart', this.onTouchStart);
    this.refs.wrapper.removeEventListener('touchend', this.onTouchEnd);
  }

  cloneItems = () => {
    if (!this.props.items) {
      return;
    }
    const slidesToShow = this.state.settings.slidesToShow;

    const numCloned = slidesToShow * 2 - 1;
    const len = this.props.items.length;
    const prior = this.props.items
      .slice(-numCloned)
      .map((d, i) => ({ ...d, 'data-index': i - len }));
    const posterior = this.props.items
      .slice(0, numCloned)
      .map((d, i) => ({ ...d, 'data-index': i }));

    this.props.items.forEach((d, i) => (d['data-index'] = i));
    const newSlides = prior.concat(this.props.items).concat(posterior);

    return newSlides;
  }

  slideHandler = (slide: number) => {
    const slidesToShow = this.state.settings.slidesToShow;
    const from = this.state.currentSlide;
    const to = slide;
    const len = this.props.items.length;
    const onEdge = to >= len || to <= 0;

    const resetToRealSlide = () => {
      this.state.transitioning = false;
      resetCurrentSlideNum();
      this.animationEndCallback = null;
    };
    const resetCurrentSlideNum = () => {
      if (from < to) {
        this.state.currentSlide = to % len;
      } else {
        this.state.currentSlide = (to % len + len) % len;
      }
      this.update();
    };
    const disableTransition = () => {
      this.refs.track.removeEventListener('transitionend', disableTransition);
      this.state.transitioning = false;
      this.update();
    };

    // turn off transition if speed is 0;
    if (!this.state.settings.speed) {
      resetCurrentSlideNum();
      return;
    }

    if (!(this.state.transitioning && onEdge)) {
      // make the transition
      this.state.currentSlide = slide;
      this.state.transitioning = true;
      this.update();

      if (onEdge) {
        // reset to non-cloned slide
        this.animationEndCallback = setTimeout(resetToRealSlide, this.state.settings.speed);
      } else {
        this.refs.track.addEventListener('transitionend', disableTransition, false);
      }
    }
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

    const pos = this.calcPos(this.state.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;
    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm
    };

    const style = Object.assign({}, { width: `${trackWidth}px` }, transformStyles);

    return style;
  }

  trackStyle = () => {
    if (!this.props.items) {
      return;
    }

    let transitionStyles;
    if (this.state.transitioning) {
      const speed = this.state.settings.speed;
      const tsVal = speed + 'ms ' + 'ease';
      transitionStyles = {
        '-webkit-transition': tsVal,
        transition: tsVal,
        'ms-transition': tsVal
      };
    }

    if (!(this.state.settings.speed)) {
      transitionStyles = {};
    }

    const style = Object.assign(this.getStaticTrackStyle(), transitionStyles);
    return style;
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

  swipeSlides = (touchObj: { startX: number, startY: number, curX: number, curY: number }) => {
    const direction: string = calSwipeDirection(touchObj);
    if (direction === 'left') {
      this.moveNext();
    }

    if (direction === 'right') {
      this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.refs.wrapper.offsetWidth;
    const slidesToShow = this.state.settings.slidesToShow;

    if (visibleWidth) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }
  }

  calcPos = (currS: number, moveDistance: number): number => {
    const slidesToShow = this.state.settings.slidesToShow;
    return (currS + slidesToShow * 2 - 1) * moveDistance;
  }
}

const calSwipeDirection = (touchObj: {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
}): string => {
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
    return 'left';
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return 'right';
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
    touchObject: {
      startX: number;
      startY: number;
      curX: number;
      curY: number;
    };
    // TODO: change type
    products: any;
  }

  export type Event = Tag.Event & { target: Element };
}

export default Carousel;
export { calSwipeDirection };
