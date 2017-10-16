import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SLIDES = 1;
const DEFAULT_TRACK_STYLE = {
  opacity: 1,
  // what is a safe default value for track width??
  width: '10000px',
  transform: `translate3d(0px, 0px, 0px)`,
  '-webkit-transform': `translate3d(0px, 0px, 0px)`,
  transition: '',
  '-webkit-transition': '',
  '-ms-transform': `translate3d(0px, 0px, 0px)`
};

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  // props: Carousel.Props = <any>{
  // };
  refs: {
    carouselwrap: HTMLDivElement,
    track: HTMLDivElement,
  };

  state: Carousel.State = <any>{
  };

  props: Carousel.Props = <any>{
    settings: {
      speed: 800,
    }
  };

  currentSlide: number = 0;
  dots: string[];
  trackStyle: any;

  moveNext = () => {
    const { settings: { slidesToShow = DEFAULT_SLIDES } = {} } = this.props;
    // todo: check slideCount
    const slideCount = this.refs.track.children.length;

    let lastSlide = this.currentSlide + slidesToShow - 1;
    if (lastSlide >= slideCount - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = (this.currentSlide + 1) % slideCount;
    }
    this.updateTrackStyleWithTransition();
  }

  movePrevious = () => {
    const { settings: { slidesToShow = DEFAULT_SLIDES } = {} } = this.props;
    const slideCount = this.refs.track.children.length;

    if (this.currentSlide === 0) {
      this.currentSlide = slideCount - slidesToShow;
    } else {
      this.currentSlide -= 1;
    }

    this.updateTrackStyleWithTransition();
  }

  swipeLeft = (event: MouseEvent & Carousel.Event | TouchEvent & Carousel.Event) => {
    // event.preventDefault();
    // event.stopPropagation();
    // utils.WINDOW().document.addEventListener('mousemove', this.onMouseMove, true);
    utils.WINDOW().document.addEventListener('touchstart', this.onTouchStart, true);
    utils.WINDOW().document.addEventListener('touchmove', this.onTouchMove, true);
    // utils.WINDOW().document.addEventListener('mouseup', this.onSwipeEnd, true);
    utils.WINDOW().document.addEventListener('touchend', this.onSwipeEnd, true);
  }

  onMouseMove = (event: MouseEvent & Carousel.Event) => {
    console.log('clientX', event);
  }

  onTouchStart = (event: TouchEvent & Carousel.Event) => {
    console.log('touch start', event);
  }

  onTouchMove = (event: TouchEvent & Carousel.Event) => {
    console.log('touch move', event);

    // if (touchEvent.target === this.state.handle) {
    //   this.redraw(touchEvent.clientX);
    // }
  }

  onSwipeEnd = (event: TouchEvent & Carousel.Event) => {
    console.log('swipe end', event);

    // utils.WINDOW().document.removeEventListener('mousemove', this.onMouseMove);
    utils.WINDOW().document.removeEventListener('touchstart', this.onTouchStart);
    utils.WINDOW().document.removeEventListener('touchmove', this.onTouchMove);
    // utils.WINDOW().document.removeEventListener('mouseup', this.onSwipeEnd);
    utils.WINDOW().document.removeEventListener('touchend', this.onSwipeEnd);
  }

  onMount() {
    // onMount or beforeMount?
    if (utils.WINDOW().addEventListener) {
      utils.WINDOW().addEventListener('resize', this.updateTrackAndSlideStyleWithoutTransition);
    }

    this.getDots();
    this.updateTrackAndSlideStyleWithTransition();
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
    this.updateSlideStyleToDom();
    this.updateTrackStyleWithTransition();
  }

  updateTrackAndSlideStyleWithoutTransition = () => {
    this.updateSlideStyleToDom();
    this.updateTrackStyleWithoutTransition();
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

  updateSlideStyleToDom: any = () => {
    const { track } = this.refs;
    const slideWidth = this.getSlideWidth();
    Array.from(track.children).forEach((c) => {
      // dynamically adding expression attributes:
      // https://github.com/riot/riot/issues/1752
      // todo: write a test to make sure this function exists on riot and it will translate into style correctly.
      c.setAttribute('style', this.styleObjectToString({ width: `${slideWidth}px` }));
      c.setAttribute('class', 'slide fade');
    });
  }

  // question: should I include updateSlideWidth in this function?
  getTrackStyle: any = () => {
    const { settings } = this.props;
    const slideCount = this.refs.track.children.length;
    const slideWidth: number = this.getSlideWidth();
    let trackWidth;

    if (settings.slidesToShow && settings.slidesToShow > 1) {
      trackWidth = (slideCount + settings.slidesToShow) * slideWidth;
    } else {
      trackWidth = slideCount * slideWidth;
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

  updateTrackStyleWithTransition = () => {
    const style = this.getTrackStyle();
    this.trackStyle = style;
    this.update();
  }

  updateTrackStyleWithoutTransition = () => {
    const style = this.getTrackStyle();
    delete style['transition'];
    delete style['-webkit-transition'];
    this.trackStyle = style;
    this.update();
  }

  getSlideWidth = () => {
    const visibleWidth = this.getVisibleWidth();
    const { settings: { slidesToShow = DEFAULT_SLIDES } = {} } = this.props;
    console.log('here')
    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      console.log('slide w', slideWidth);
      return slideWidth;
    }

    // todo: handle edge cases?

  }

  getVisibleWidth = () => this.refs.carouselwrap.offsetWidth;

  swipeDirection: any = (touchObject) => {
    let xDist: any;
    let yDist: any;
    let r: any;
    let swipeAngle: any;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if ((swipeAngle <= 45) && (swipeAngle >= 0) || (swipeAngle <= 360) && (swipeAngle >= 315)) {
      return ('left');
    }
    if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
      return ('right');
    }
  }
}

const calcPos = (currS: number, moveDistance: number): number => {
  return (currS) * moveDistance;
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