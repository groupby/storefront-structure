import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SETTINGS = {
  transition: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
};

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  refs: {
    carouselwrap: HTMLDivElement,
    track: HTMLDivElement,
  };

  props: Carousel.Props = <any>{ settings: DEFAULT_SETTINGS };

  touchObject: {
    startX: number,
    startY: number,
    curX: number,
    curY: number
  };

  currentSlide: number = 0;
  transitioning: boolean = false;
  animationEndCallback: any;
  alreadyReset: boolean;
  state: Carousel.State = {
    message: ''
  };

  onMount() {
    utils.WINDOW().addEventListener('resize', this.updateWindow);
    console.log('mounting')
  }

  onUnMount() {
    utils.WINDOW().removeEventListener('resize', this.updateWindow);
  }

  onUpdate() {
    console.log(this.currentSlide);
  }

  updateWindow = () => {
    this.update();
  }

  moveNext = () => {
    // tslint:disable-next-line:max-line-length
    this.slideHandler(this.currentSlide + (this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll), 'next');
    this.set({ message: 'next' });
  }

  movePrevious = () => {
    // tslint:disable-next-line:max-line-length
    this.slideHandler(this.currentSlide - (this.props.settings.slidesToScroll || DEFAULT_SETTINGS.slidesToScroll), 'previous');
  }

  onTouchStart = (e: TouchEvent & Carousel.Event) => {
    // e.preventDefault();
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

    // swipe distance needs to be more than 20
    if (Math.abs(this.touchObject.curX - this.touchObject.startX) < 20) {
      this.refs.carouselwrap.removeEventListener('touchstart', this.onTouchStart);
      this.refs.carouselwrap.removeEventListener('touchend', this.onTouchEnd);
      return;
    }

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
        preCloneSlides.push({
          ...data,
          'data-index': key,
        });
      }

      if (index < slidesToShow) {
        let key = itemCount + index;
        postCloneSlides.push({
          ...data,
          'data-index': key,
        });
      }
    });

    return preCloneSlides.concat(this.props.items, postCloneSlides);
  }

  slideHandler = (slide: number, direction: string) => {
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const from = this.currentSlide;
    const to = slide;
    const threshold = this.props.items.length;
    const rightbound = slide + slidesToShow - 1;
    const onEdge = (s) => s + slidesToShow - 1 >= threshold || s < 0;
    const isOnEdge = onEdge(slide);

    const regroup = (s) => (s + slidesToShow - 1 >= threshold && s < threshold) || s < 0 && s > -threshold;
    // check if it has just been reset to another on edge case
    // todo: this will break when alternate direction of on edge is hit
    // this.alreadyReset = onEdge(this.currentSlide);
    // console.log('already reset', this.alreadyReset);

    const resetToRealSlide = () => {
      this.transitioning = false;
      resetCurrentSlideNum();
      this.update();
      delete this.animationEndCallback;
    };
    const disableTransition = () => {
      this.refs.track.removeEventListener('transitionend', disableTransition);
      this.transitioning = false;
      this.update();
    };
    const resetCurrentSlideNum = () => {
      switch (direction) {
        case 'next':
        this.currentSlide = this.currentSlide - threshold;
          break;
        case 'previous':
        this.currentSlide = this.currentSlide + threshold;
          break;
        default:
          console.error((e) => 'message should be next or previous');
          break;
      }
    };

    const outsideCloned = (s: number) => s < -slidesToShow || s >= threshold + slidesToShow;

    if (!(this.transitioning && isOnEdge)) {
      // make the transition
      // tslint:disable-next-line:max-line-length
      if (regroup(slide)) {
        console.log('regroup')
        // regroup the set of tiles before entering cloned area
        switch (direction) {
          case 'next':
            this.currentSlide = threshold - slidesToShow;
            break;
          case 'previous':
            this.currentSlide === 0 ? this.currentSlide = slide : this.currentSlide = 0;
            break;
          default:
            console.error((e) => 'message should be next or previous');
            break;
        }
        // this.alreadyReset = true;
      } else {
        this.currentSlide = slide;
        // this.alreadyReset = false;
      }
      console.log('this.cu', this.currentSlide)
      if (outsideCloned(this.currentSlide)) {
        console.log('outside clone', this.currentSlide);
        resetCurrentSlideNum();
        console.log('after reset', this.currentSlide);
      }
      this.transitioning = true;
      this.update();

      if (isOnEdge) {
        // if the target slide is cloned slide, change it to its corresponding non-cloned slide
        // also set transition to false after it is done
        this.animationEndCallback = setTimeout(resetToRealSlide, this.props.settings.speed);
      } else {
        // if not, only set transition to false after it is done
        this.refs.track.addEventListener('transitionend', disableTransition);
      }
    }
  }

  dotHandler = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const slide = parseInt((e.target as HTMLElement).getAttribute('data-index-to-go')) * slidesToShow;
    this.slideHandler(slide, 'dot');
  }

  slideStyle = () => {
    const slideWidth = this.getSlideWidth();
    return {
      width: `${slideWidth}px`,
    };
  }

  getStaticTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const slideCount = this.props.items.length;
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;
    const trackWidth = (slideCount + 2 * slidesToShow) * slideWidth;

    const pos = this.calcPos(this.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;
    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm,
    };

    const style = Object.assign({}, {
      width: `${trackWidth}px`,
    },
      transformStyles);

    return style;
  }

  trackStyle = () => {
    if (!(this.cloneItems() && this.props.items)) {
      return;
    }

    let transitionStyles;

    if (this.transitioning) {
      const transition = typeof this.props.settings.transition === 'boolean' ?
        this.props.settings.transition : DEFAULT_SETTINGS.transition;
      const speed = this.props.settings.speed || DEFAULT_SETTINGS.speed;
      const tsVal = speed + 'ms ' + 'ease';
      transitionStyles = transition === true ? {
        '-webkit-transition': tsVal,
        transition: tsVal,
        'ms-transition': tsVal
      } : {};
    } else {
      transitionStyles = {
        '-webkit-transition': '',
        transition: '',
        'ms-transition': ''
      };
    }

    const style = Object.assign(this.getStaticTrackStyle(), transitionStyles);
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

  dotStyle = (i: number) => {
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
    if (direction === 'left') {
      this.moveNext();
    } else if (direction === 'right') {
      this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.refs.carouselwrap.offsetWidth;
    console.log('visible', visibleWidth)
    const slidesToShow = this.props.settings.slidesToShow || DEFAULT_SETTINGS.slidesToShow;

    if (visibleWidth) {
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
  console.log('touch', touchObj)

  const r = Math.atan2(yDist, xDist);

  let swipeAngle = Math.round(r * 180 / Math.PI);

  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  // swipeAngle between 45 and 135, between 225 and 315 is ignored;
  if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
    return 'left';
  }
  if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
    return 'right';
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
    message: string;
  }

  export type Event = Tag.Event & { target: Element };
}

export default Carousel;
export { calSwipeDirection };