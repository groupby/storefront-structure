import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SLIDES = 1;
const DEFAULT_TRACK_STYLE = {
  opacity: 1,
  // what is a safe default value for track width??
  transform: `translate3d(0px, 0px, 0px)`,
  '-webkit-transform': `translate3d(0px, 0px, 0px)`,
  transition: '',
  '-webkit-transition': '',
  '-ms-transform': `translate3d(0px, 0px, 0px)`
};

const DEFAULT_SETTINGS = {
  fade: true,
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0
};

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  // props: Carousel.Props = <any>{
  // };
  refs: {
    carouselwrap: HTMLElement,
    track: HTMLDivElement,
  };

  props: Carousel.Props = <any>DEFAULT_SETTINGS;

  touchObject: {
    startX: number,
    startY: number,
    curX: number,
    curY: number
  };

  currentSlide: number = 0;
  dots: string[];
  trackStyle: any;

  moveNext = () => {
    // best practice to get default settings?
    const { settings = DEFAULT_SETTINGS } = this.props;
    // todo: check slideCount
    const slideCount = this.refs.track.children.length;

    let lastSlide = this.currentSlide + settings.slidesToShow - 1;

    // if (lastSlide)

    if (lastSlide >= slideCount - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = (this.currentSlide + 1) % slideCount;
    }

    const slideWidth = this.getSlideWidth();
    this.updateTrackStyleWithTransition(slideWidth);
  }

  movePrevious = () => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const slideCount = this.refs.track.children.length;

    if (this.currentSlide === 0) {
      this.currentSlide = slideCount - settings.slidesToShow;
    } else {
      this.currentSlide -= 1;
    }
    const slideWidth = this.getSlideWidth();
    this.updateTrackStyleWithTransition(slideWidth);
  }

  onTouchStart = (event: TouchEvent & Carousel.Event) => {
    event.preventDefault();
    event.stopPropagation();

    const posX = event.touches[0].pageX;
    const posY = event.touches[0].pageY;

    // doesn't allow event.clientX
    // const posX = (event.touches !== undefined) ? event.touches[0].pageX : event.clientX;
    // const posY = (event.touches !== undefined) ? event.touches[0].pageY : event.clientY;

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

    // this.touchObject.curX = (event.touches) ? event.touches[0].pageX : event.clientX;
    // this.touchObject.curY = (event.touches) ? event.touches[0].pageY : event.clientY;

    this.swipeSlides(this.touchObject);
    this.refs.carouselwrap.removeEventListener('touchstart', this.onTouchStart);
    this.refs.carouselwrap.removeEventListener('touchend', this.onTouchEnd);
  }

  onMount() {
    // onMount or beforeMount?
    if (this.refs.carouselwrap.addEventListener) {
      utils.WINDOW().addEventListener('resize', this.updateTrackAndSlideStyleWithoutTransition, true);
    }

    this.getDots();
    this.updateTrackAndSlideStyleWithTransition();
    this.cloneFirstAndLastSlides();
  }

  onUpdate() {
    // todo: add setAttribute again
  }

  onUnMount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.updateTrackAndSlideStyleWithoutTransition);
    }
  }

  updateTrackAndSlideStyleWithTransition = () => {
    // need same slideWidth for these two functions
    const slideWidth = this.getSlideWidth();

    this.updateSlideStyleToDom(slideWidth);
    this.updateTrackStyleWithTransition(slideWidth);
  }

  updateTrackAndSlideStyleWithoutTransition = () => {
    const slideWidth = this.getSlideWidth();

    this.updateSlideStyleToDom(slideWidth);
    this.updateTrackStyleWithoutTransition(slideWidth);
  }

  getDots: any = () => {
    const slideCount = this.refs.track.children.length;
    const { slidesToShow } = this.props.settings;
    const { slidesToScroll } = this.props.settings;

    const dotCount = Math.ceil((slideCount - slidesToShow) / slidesToScroll + 1);
    this.dots = Array(dotCount).fill('dot');
  }

  styleObjectToString: any = (style) => {
    return Object.keys(style).reduce(function (acc: string, prop: string) {
      return (acc + ' ' + prop + ': ' + (style[prop]) + ';');
    }, '');
  }

  updateSlideStyleToDom: any = (slideWidth) => {
    const { track } = this.refs;
    Array.from(track.children).forEach((c, index) => {
      // dynamically adding expression attributes:
      // https://github.com/riot/riot/issues/1752
      // todo: write a test to make sure this function exists on riot and it will translate into style correctly.
      c.setAttribute('style', this.styleObjectToString({ width: `${slideWidth}px` }));
      c.setAttribute('class', 'slide fade');
      c.setAttribute('key', index.toString());
    });

  }

  cloneFirstAndLastSlides = () => {
    const { track } = this.refs;
    const clonedHead = track.children[0].cloneNode(true);
    const clonedTail = track.children[6].cloneNode(true);

    track.appendChild(clonedHead);
    track.insertBefore(clonedTail, track.children[0]);
  }

  // question: should I include updateSlideWidth in this function?
  getTrackStyle: any = (slideWidth) => {
    const { settings } = this.props;
    const slideCount = this.refs.track.children.length;
    let trackWidth;

    if (settings.slidesToShow) {
      // trackWidth = (slideCount + settings.slidesToShow) * slideWidth;
      trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
    } else {
      // trackWidth = slideCount * slideWidth;
      trackWidth = (slideCount + 2) * slideWidth;
    }
    const pos = calcPos(this.currentSlide, slideWidth);
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

    const style = Object.assign({}, DEFAULT_TRACK_STYLE, {
      width: `${trackWidth}px`,
    },
      transformStyles,
      transitionStyles);
    return style;
  }

  updateTrackStyleWithTransition = (slideWidth: number) => {
    // todo: explore debounce
    const style = this.getTrackStyle(slideWidth);
    this.trackStyle = style;
    this.update();
  }

  updateTrackStyleWithoutTransition = (slideWidth: number) => {
    const style = this.getTrackStyle(slideWidth);
    delete style['transition'];
    delete style['-webkit-transition'];
    this.trackStyle = style;
    this.update();
  }

  swipeSlides = (touchObj: { startX: number, startY: number, curX: number, curY: number }) => {
    const direction: string = calSwipeDirection(touchObj);

    if (direction) {
      direction === 'left' ? this.moveNext() : this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.getVisibleWidth();
    const { settings: { slidesToShow = DEFAULT_SLIDES } = {} } = this.props;
    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }

    // todo: handle edge cases?

  }

  getVisibleWidth = () => this.refs.carouselwrap.offsetWidth;

}

const calcPos = (currS: number, moveDistance: number): number => {
  return (currS) * moveDistance;
};

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
  }

  export interface State {
  }

  export type Event = Tag.Event & { target: Element };
}

export type Image = { url: string };

export default Carousel;