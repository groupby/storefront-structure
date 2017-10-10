import { tag, utils, Tag } from '@storefront/core';

import './track/track';

@tag('gb-carousel', require('./index.html'), require('./index.css'))
class Carousel {
  // props: Carousel.Props = <any>{
  // };

  state: Carousel.State = <any>{
    imgQuantity: 3,
  };

  spec: Carousel.Spec = <any>{
    settings: {}
  };

  currentSlide: number = 0;

  slideCount: number = 3;

  moveNext = () => {
    this.currentSlide = (this.currentSlide + 1) % this.state.imgQuantity;
  }

  movePrevious = () => {
    if (this.currentSlide === 0) {
      this.currentSlide = this.state.imgQuantity - 1;
    } else {
      this.currentSlide -= 1;
    }
  }

  onBeforeMount() {
    this.update(this.spec.settings = this.props.settings);
  }

  onMount() {
    // console.log('carousel settings are', this.spec.settings);
  }
}

const changeSlide = (currentSlide) => {
  const slidesToScroll = 1;
  const slidesToShow = 1;

  const slideCount = 3;
  const slideOffset = -300;
  const targetLeft = -300 * currentSlide; // from trackHelper.js

  // let unevenOffset = (slideCount % slidesToScroll !== 0);
  // let indexOffset = unevenOffset ? 0 : (slideCount - currentSlide) % slidesToScroll;

  // if (options.message === 'previous') {
  //   let slideOffset = (indexOffset === 0) ? slidesToScroll : slidesToShow - indexOffset;
  //   let targetSlide = currentSlide - slideOffset;
  //   if (this.props.lazyLoad) {
  //     let previousInt = currentSlide - slideOffset;
  //     targetSlide = previousInt === -1 ? slideCount - 1 : previousInt;
  //   }
  // } else if (options.message === 'next') {
  //   let slideOffset = (indexOffset === 0) ? slidesToScroll : indexOffset;
  //   let targetSlide = currentSlide + slideOffset;
  //   if (this.props.lazyLoad) {
  //     targetSlide = ((currentSlide + slidesToScroll) % slideCount) + indexOffset;
  //   }
  // } else if (options.message === 'dots' || options.message === 'children') {
  //   // click on dots
  //   let targetSlide = options.index * options.slidesToScroll;
  //   if (targetSlide === options.currentSlide) {
  //     return;
  //   }
  // } else if (options.message === 'index') {
  //   let targetSlide = Number(options.index);
  //   if (targetSlide === options.currentSlide) {
  //     return;
  //   }
  // }

  // slideHandler(targetSlide);
};

// const slideHandler = (index) => {
//   // Functionality of animateSlide and postSlide is merged into this function
//   console.log('slideHandler', index);
//   var targetSlide, currentSlide;
//   var targetLeft, currentLeft;
//   var callback;

//   if (this.props.waitForAnimate && this.state.animating) {
//     return;
//   }
//   console.log(1)

//   //not fade
//   if (this.props.fade) {
//     currentSlide = this.currentSlide;

//     // Don't change slide if it's not infite and current slide is the first or last slide.
//     if(this.props.infinite === false &&
//       (index < 0 || index >= this.state.slideCount)) {
//       return;
//     }
//     //  Shifting targetSlide back into the range
//     if (index < 0) {
//       targetSlide = index + this.state.slideCount;
//     } else if (index >= this.state.slideCount) {
//       targetSlide = index - this.state.slideCount;
//     } else {
//       targetSlide = index;
//     }

//     if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
//       this.setState({
//         lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide)
//       });
//     }
//     //not being used
//     callback = () => {
//       this.setState({
//         animating: false
//       });
//       if (this.props.afterChange) {
//         this.props.afterChange(targetSlide);
//       }
//       delete this.animationEndCallback;
//     };

//     this.setState({
//       animating: true,
//       currentSlide: targetSlide
//     }, function () {
//       this.animationEndCallback = setTimeout(callback, this.props.speed);
//     });

//     if (this.props.beforeChange) {
//       this.props.beforeChange(this.state.currentSlide, targetSlide);
//     }

//     this.autoPlay();
//     return;
//   }

//   //came down here
//   targetSlide = index;
//   if (targetSlide < 0) {
//     if(this.props.infinite === false) {
//       currentSlide = 0;
//     } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
//       currentSlide = this.state.slideCount - (this.state.slideCount % this.props.slidesToScroll);
//     } else {
//       currentSlide = this.state.slideCount + targetSlide;
//     }
//   } else if (targetSlide >= this.state.slideCount) {
//     if(this.props.infinite === false) {
//       currentSlide = this.state.slideCount - this.props.slidesToShow;
//     } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
//       currentSlide = 0;
//     } else {
//       currentSlide = targetSlide - this.state.slideCount;
//     }
//   } else {
//     currentSlide = targetSlide;
//   }

//   console.log('targetSlide is', targetSlide, 'currentSlide is', currentSlide)

//   targetLeft = getTrackLeft(assign({
//     slideIndex: targetSlide,
//     trackRef: this.track
//   }, this.props, this.state));

//   currentLeft = getTrackLeft(assign({
//     slideIndex: currentSlide,
//     trackRef: this.track
//   }, this.props, this.state));

//   console.log('targetLeft', targetLeft, 'currentLeft', currentLeft)

//   if (this.props.infinite === false) {
//     targetLeft = currentLeft;
//   }

//   //not used
//   if (this.props.beforeChange) {
//     console.log(4)
//     this.props.beforeChange(this.state.currentSlide, currentSlide);
//   }

//   if (this.props.lazyLoad) {
//     var loaded = true;
//     var slidesToLoad = [];
//     for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++ ) {
//       loaded = loaded && (this.state.lazyLoadedList.indexOf(i) >= 0);
//       if (!loaded) {
//         slidesToLoad.push(i);
//       }
//     }
//     if (!loaded) {
//       this.setState({
//         lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
//       });
//     }
//   }

//   // Slide Transition happens here.
//   // animated transition happens to target Slide and
//   // non - animated transition happens to current Slide
//   // If CSS transitions are false, directly go the current slide.

//   if (this.props.useCSS === false) {
//     console.log('useCSS is false')
//     this.setState({
//       currentSlide: currentSlide,
//       trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state))
//     }, function () {
//       if (this.props.afterChange) {
//         this.props.afterChange(currentSlide);
//       }
//     });

//   } else {
//     console.log('useCSS is true')//true
//     var nextStateChanges = {
//       animating: false,
//       currentSlide: currentSlide,
//       trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state)),
//       swipeLeft: null
//     };

//     callback = () => {
//       this.setState(nextStateChanges);
//       if (this.props.afterChange) {
//         this.props.afterChange(currentSlide);
//       }
//       delete this.animationEndCallback;
//     };

//     this.setState({
//       animating: true,
//       currentSlide: currentSlide,
//       trackStyle: getTrackAnimateCSS(assign({left: targetLeft}, this.props, this.state))
//     }, function () {
//       this.animationEndCallback = setTimeout(callback, this.props.speed);
//     });
//     console.log('animation set state:', this.state)

//   }

//   this.autoPlay();
// }

interface Carousel extends Tag<Carousel.Props> { }
namespace Carousel {
  export interface Props extends Tag.Props {
    settings: object;
  }

  export interface State {
    images: Image[];
    imgQuantity: number;
  }

  export interface Spec {
    settings: any;
  }
}

export type Image = { url: string };

export default Carousel;