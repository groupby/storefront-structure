import { tag, utils, Tag } from '@storefront/core';

const DEFAULT_SLIDES = 1;

const DEFAULT_SETTINGS = {
  fade: true,
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0
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
  dots: string[];


  moveNext = () => {
    this.getCurrentSlideOnNext();
    const listener = () => {
      this.currentSlide = 0;
      this.refs.track.removeEventListener('transitionend', listener);
      this.update();
      console.log('transition end', this.currentSlide)
    };

    const threshold = this.getUpdatedItems().length;
    if (this.currentSlide === threshold) {
      this.refs.track.addEventListener('transitionend', listener);  
    }

    // const slideWidth = this.getSlideWidth();
    // this.updateTrackStyleWithTransition(slideWidth);

  }

  movePrevious = () => {
    this.getCurrentSlideOnPrev();
    // const slideWidth = this.getSlideWidth();
    // this.updateTrackStyleWithTransition(slideWidth);
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
  }

  onUpdate() {
    const count = this.getDotsCount();
    this.populateDots(count);
    this.addClassToDot();

  }

  onUnMount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.updateTrackAndSlideStyleWithoutTransition);
    }
  }

  getUpdatedItems = () => {
    if (this.props.items) {
      const infiniteCount = this.props.settings.slidesToShow;
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

  getCurrentSlideOnNext = () => {
    // best practice to get default settings?
    const { settings = DEFAULT_SETTINGS } = this.props;
    // todo: check slideCount
    const slideCount = this.props.items.length;

    let lastSlide = this.currentSlide + settings.slidesToShow - 1;

    if (lastSlide = slideCount + settings.slidesToShow - 1 ) {
      console.log('coming to the first one')
      this.currentSlide += settings.slidesToScroll;
      console.log('looping starts', this.currentSlide)
      
      
      
    } else {
      this.currentSlide += settings.slidesToScroll;
      // const newSlide = (this.currentSlide + settings.slidesToScroll) % slideCount;
      // if (slideCount - newSlide < settings.slidesToShow) {
      //   this.currentSlide = slideCount - settings.slidesToShow;
      // } else {
      //   this.currentSlide = newSlide;
      // }
    }
  }

  getCurrentSlideOnPrev = () => {
    const { settings = DEFAULT_SETTINGS } = this.props;
    const slideCount = this.props.items.length;

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

    this.updateTrackStyleWithTransition();
  }

  updateTrackAndSlideStyleWithoutTransition = () => {
    const slideWidth = this.getSlideWidth();

    // this.updateTrackStyleWithoutTransition();
  }

  getDotsCount: any = () => {
    const slideCount = this.props.items.length;
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

    const dotCount = this.getDotsCount();

    Array.from(dots.children).forEach((child, i) => {
      let leftBound = (i * slidesToScroll);
      let rightBound = i * slidesToScroll + slidesToShow - 1;

      let lastSlide = this.currentSlide + slidesToShow - 1;

      if (this.currentSlide + slidesToScroll + slidesToShow - 1 > count) {
        i === dots.children.length - 1 ? addClass(child) : removeClass(child);

      } else if (this.currentSlide >= leftBound && this.currentSlide <= rightBound) {
        addClass(child);
      } else {
        removeClass(child);
      }

    });

    Array.from(dots.children).forEach((c, i) => {
      i === currentDot ? addClass(c) : removeClass(c);
    });
  }

  getSlidesToShow = () => this.props.settings.slidesToShow;

  getSlideStyle = () => {
    const slideWidth = this.getSlideWidth();
    return {
      width: `${slideWidth}px`,
      outline: 'none',
    };
  }

  // question: should I include updateSlideWidth in this function?
  getTrackStyle = () => {
    const slideWidth = this.getSlideWidth();
    const { settings } = this.props;
    const slideCount = this.getUpdatedItems().length;
    let trackWidth;

    if (settings.slidesToShow) {
      trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
    } else {
      trackWidth = (slideCount + 2) * slideWidth;
    }
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
      console.log('track style called')
    if(this.currentSlide === 0) {
      delete style['transition'];
      delete style['-webkit-transition'];
      
    }
    return style;
  }

  updateTrackStyleWithTransition = () => {
    // todo: explore debounce
    
    // const style = this.getTrackStyle();
    // this.trackStyle = style;
    // this.update();
  }

  secretTransition = () => {
    const slideWidth = this.getSlideWidth();
    const { settings } = this.props;
    const slideCount = this.getUpdatedItems().length;
    let trackWidth;

    if (settings.slidesToShow) {
      trackWidth = (slideCount + 2 * settings.slidesToShow) * slideWidth;
    } else {
      trackWidth = (slideCount + 2) * slideWidth;
    }
    const pos = this.calcPos(this.currentSlide, slideWidth);
    const tfm = `translate3d(-${pos}px, 0px, 0px)`;
    const transformStyles = {
      transform: tfm,
      '-webkit-transform': tfm,
      '-ms-transform': tfm,
    };
    console.log('secret is called')

    return Object.assign({}, {
      width: `${trackWidth}px`,
    },
      transformStyles,
      );
  }

  swipeSlides = (touchObj: { startX: number, startY: number, curX: number, curY: number }) => {
    const direction: string = calSwipeDirection(touchObj);

    if (direction) {
      direction === 'left' ? this.moveNext() : this.movePrevious();
    }
  }

  getSlideWidth = () => {
    const visibleWidth = this.getVisibleWidth();
    const { settings = DEFAULT_SETTINGS } = this.props;
    const { slidesToShow } = settings
    if (visibleWidth && slidesToShow) {
      const slideWidth = visibleWidth / slidesToShow;
      return slideWidth;
    }

    // todo: handle edge cases?

  }

  getVisibleWidth = () => this.refs.carouselwrap.offsetWidth;
  
  calcPos = (currS: number, moveDistance: number): number => {
    // needs slidesToShow
    return (currS + 1) * moveDistance;
  };
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