import { tag, utils, Tag } from '@storefront/core';

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  // props: Carousel.Props = <any>{
  // };
  refs: {
    track: HTMLDivElement,
  };

  state: Carousel.State = <any>{
  };

  props: Carousel.Props = <any>{
    settings: {
      speed: 800,
    }
  };

  slideCount: number;
  slidesToShow: number;
  slidesToScroll: number;
  currentSlide: number = 0;
  dots: string [];

  // todo: what is the riot way to do it?
  visibleWidth: number;

  slideWidth: number = this.visibleWidth;

  slideStyle: any = {
    width: `${this.slideWidth}px`,
  };

  trackStyle: any = {
    'max-height': '300px',
    opacity: 1,
    // what is a safe default value for track width??
    width: '10000px',
    transform: `translate3d(0px, 0px, 0px)`,
    '-webkit-transform': `translate3d(0px, 0px, 0px)`,
    transition: '',
    '-webkit-transition': '',
    '-ms-transform': `translate3d(0px, 0px, 0px)`
  };

  moveNext = () => {
    let lastSlide = this.currentSlide + this.slidesToShow - 1;
    if (lastSlide >= this.slideCount - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = (this.currentSlide + 1) % this.slideCount;
    }
    this.updateTrackStyle(this.currentSlide);
  }

  movePrevious = () => {
    if (this.currentSlide === 0) {
      this.currentSlide = this.slideCount - this.slidesToShow;
    } else {
      this.currentSlide -= 1;
    }

    this.updateTrackStyle(this.currentSlide);
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

  onBeforeMount() {
    // this.update(this.spec.settings = this.props.settings);
    if (!window) {
      return;
    }
    if (window.addEventListener) {
      window.addEventListener('resize', () => {
        // todo: unlink window size, link parent div width
        // this.windowSize = window.innerWidth;
        // this.updateSlideWidth(this.windowSize);
        // this.update();
      });
    }
  }

  onMount() {
    this.populateProps();
    this.updateSlideWidth(this.visibleWidth); // this function has this.update() at the end
    this.updateTrackStyle(this.currentSlide);
    this.updateSlideStyleToDom();

  }

  onUpdate() {
    // todo: add setAttribute again
  }

  populateProps: any = () => {
    const { track } = this.refs;
    const slideCount = track.children.length;
    this.slidesToShow = this.props.settings.slidesToShow;
    this.slidesToScroll = this.props.settings.slidesToScroll;
    this.slideCount = slideCount;
    this.visibleWidth = document.getElementById('carousel-list').offsetWidth;

    const dotCount = Math.ceil(( this.slideCount - this.slidesToShow ) / this.slidesToScroll + 1 );
    this.dots = Array(dotCount).fill('dot');
  }

  styleObjectToString: any = (style) => {
    return Object.keys(style).reduce(function (acc: string, prop: string) {
      return (acc + ' ' + prop + ': ' + (style[prop]) + ';');
    }, '');
  }

  updateSlideStyleToDom: any = () => {
    const { track } = this.refs;
    Array.from(track.children).forEach((c) => {
      // dynamically adding expression attributes:
      // https://github.com/riot/riot/issues/1752
      // todo: write a test to make sure this function exists on riot and it will translate into style correctly.
      c.setAttribute('style', this.styleObjectToString(this.slideStyle));
      c.setAttribute('class', 'slide fade');
    });
  }

  // question: should I include updateSlideWidth in this function?
  updateTrackStyle: any = (currentSlide) => {
    const { track } = this.refs;
    const { settings } = this.props;
    const style = this.trackStyle;
    const slideCount = this.refs.track.children.length;
    const slideWidth = this.slideWidth;
    let trackWidth;

    if (settings.slidesToShow && settings.slidesToShow > 1) {
      trackWidth = (slideCount + settings.slidesToShow) * slideWidth;
    } else {
      trackWidth = slideCount * slideWidth;
    }
    Object.assign(style, { width: `${trackWidth}px` });

    const pos = calcPos(currentSlide, slideWidth);

    style.transform = `translate3d(-${pos}px, 0px, 0px)`;
    style['-webkit-transform'] = `translate3d(-${pos}px, 0px, 0px)`;
    style['-ms-transform'] = `translate3d(-${pos}px, 0px, 0px)`;

    if (settings.fade === true) {
      style.WebkitTransition = '-webkit-transform ' + settings.speed + 'ms ' + 'ease';
      style.transition = 'transform ' + settings.speed + 'ms ' + 'ease';
    }
    this.update(this.trackStyle = style);

  }

  updateSlideWidth: any = (totalWidth: number) => {
    const { slidesToShow } = this.props.settings;
    const slideWidth = totalWidth / slidesToShow;
    this.slideWidth = slideWidth;
    this.slideStyle.width = `${slideWidth}px`;
    this.update();
  }

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