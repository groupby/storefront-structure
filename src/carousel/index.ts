import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SLIDES = 1;
const DEFAULT_TRACK_STYLE = {
  opacity: 1,
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
    dots: HTMLDivElement
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
    this.getCurrentSlideOnNext();

    const slideWidth = this.getSlideWidth();
    this.updateTrackStyleWithTransition(slideWidth);

  }

  movePrevious = () => {
    this.getCurrentSlideOnPrev();
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

    const count = this.getDotsCount();
    this.populateDots(count);
    this.updateTrackAndSlideStyleWithTransition();
    this.addClassToDot();
    console.log('products in ca', this.props.items)

    // this.cloneFirstAndLastSlides();
  }

  onUpdate() {
    // todo: add setAttribute again
    this.addClassToDot();
  }

  onUnMount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.updateTrackAndSlideStyleWithoutTransition);
    }
  }

  getCurrentSlideOnNext = () => {
    // best practice to get default settings?
    const { settings = DEFAULT_SETTINGS } = this.props;
    // todo: check slideCount
    const slideCount = this.refs.track.children.length;

    let lastSlide = this.currentSlide + settings.slidesToShow - 1;

    if (lastSlide >= slideCount - 1) {
      this.currentSlide = 0;
    } else {
      const newSlide = (this.currentSlide + settings.slidesToScroll) % slideCount;
      if (slideCount - newSlide < settings.slidesToShow) {
        this.currentSlide = slideCount - settings.slidesToShow;
      } else {
        this.currentSlide = newSlide;
      }
    }
  }

  getCurrentSlideOnPrev = () => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const slideCount = this.refs.track.children.length;

    if (this.currentSlide === 0) {
      this.currentSlide = slideCount - settings.slidesToShow;
    } else if (this.currentSlide < settings.slidesToScroll) {
      this.currentSlide = 0;
    } else {
      this.currentSlide -= settings.slidesToScroll;
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

  getDotsCount: any = () => {
    const slideCount = this.refs.track.children.length;
    const { slidesToShow } = this.props.settings;
    const { slidesToScroll } = this.props.settings;

    const dotCount = Math.ceil((slideCount - slidesToShow) / slidesToScroll + 1);
    return dotCount;
  }

  populateDots: any = (count) => {
    this.dots = Array(count).fill('dot');
  }

  getCurrentDot: any = () => {

    // todo: refactor this
    const slidesToShow = this.getSlidesToShow();
    const count = this.refs.track.children.length;
    if (this.currentSlide <= count - slidesToShow) {
      return this.currentSlide;
    } else {
      return 0;
    }
  }

  addClassToDot: any = () => {
    const currentDot = this.getCurrentDot();

    const { dots } = this.refs;
    const { slidesToScroll } = this.props.settings;
    const { slidesToShow } = this.props.settings;
    const count = this.refs.track.children.length;
    const addClass = (i) => {
      i.className = i.className.replace('active', '');
      i.className += 'active';
    };
    const removeClass = (i) => i.className = i.className.replace('active', '');

    // const dotCount = this.getDotsCount();

    // Array.from(dots.children).forEach((child, i) => {
    //   let leftBound = (i * slidesToScroll);
    //   let rightBound = i * slidesToScroll + slidesToShow - 1;

    //   let lastSlide = this.currentSlide + slidesToShow - 1;

    //   if (this.currentSlide + slidesToScroll + slidesToShow - 1 > count) {
    //     i === dots.children.length - 1 ? addClass(child) : removeClass(child);

    //   } else if (this.currentSlide >= leftBound && this.currentSlide <= rightBound) {
    //     addClass(child);
    //   } else {
    //     removeClass(child);
    //   }

    // });

    Array.from(dots.children).forEach((c, i) => {
      i === currentDot ? addClass(c) : removeClass(c);
    });
  }

  getSlidesToShow = () => this.props.settings.slidesToShow;

  styleObjectToString: any = (style) => {
    return Object.keys(style).reduce(function (acc: string, prop: string) {
      return (acc + ' ' + prop + ': ' + (style[prop]) + ';');
    }, '');
  }

  updateSlideStyleToDom: any = (slideWidth) => {
    let preCloneSlides = [];
    let postCloneSlides = [];
    const count = this.refs.track.children.length;
    const { slidesToShow } = this.props.settings;

    const { track } = this.refs;
    Array.from(track.children).forEach((child, index) => {
      // dynamically adding expression attributes:
      // https://github.com/riot/riot/issues/1752
      // todo: write a test to make sure this function exists on riot and it will translate into style correctly.
      console.log('slide slide width', slideWidth)
      child.setAttribute('style', this.styleObjectToString({
        width: `${slideWidth}px`,
        outline: 'none',
      }));
      child.setAttribute('class', 'carousel-slide');
      child.setAttribute('key', index.toString());

      // const infiniteCount = slidesToShow;

      // if (index >= (count - infiniteCount)) {
      //   const key = -(count - index);
      //   // now clonedChild is a node which can't be set attribute
      //   const clonedChild = child.cloneNode(true);
      //   clonedChild.setA;
      //   console.log('child', this.refs);

      //  track.appendChild(clonedChild);
      //   // cannot set keys and classes
      // } else if (index < infiniteCount) {
      //   const clonedChild = child.cloneNode(true);

      //   track.insertBefore(clonedChild, track.children[index]);
      // }
    });

    // track.appendChild(preCloneSlides);
    // track.insertBefore(postCloneSlides, track.children[0]);

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
      trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
    } else {
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
      items: any;
    };
  }

  export interface State {
  }

  export type Event = Tag.Event & { target: Element };
}

export type Image = { url: string };

export default Carousel;