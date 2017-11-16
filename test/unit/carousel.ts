import { utils } from '@storefront/core';
import * as sinon from 'sinon';
import Carousel, { calSwipeDirection } from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {
  let carousel: Carousel;
  let DEFAULT_SETTINGS;

  describe('settings', () => {
    it('should default to default settings if no settings are passed in', () => {
      carousel = new Carousel();
      DEFAULT_SETTINGS = {
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1
      };

      expect(carousel.props.settings).to.deep.eq(DEFAULT_SETTINGS);
    });
  });

  describe('functions', () => {
    beforeEach(() => {
      carousel = new Carousel();
      DEFAULT_SETTINGS = {
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1
      };
      carousel.props.items = [
        { content: 'test0' },
        { content: 'test1' },
        { content: 'test2' },
        { content: 'test3' },
        { content: 'test4' },
        { content: 'test5' },
        { content: 'test6' },
        { content: 'test7' },
        { content: 'test8' },
        { content: 'test9' },
      ];
      carousel.props.settings = {
        speed: 500
      };
    });

    describe('onMount()', () => {
      it('should add event listener for window resize', () => {
        const addEventListener = spy();
        stub(utils, 'WINDOW').returns({ addEventListener });

        carousel.onMount();

        expect(addEventListener).to.have.been.calledWithExactly(
          'resize',
          carousel.updateWindow
        );
      });
    });

    describe('onUnMount()', () => {
      it('should add event listener for window resize', () => {
        const removeEventListener = spy();
        stub(utils, 'WINDOW').returns({ removeEventListener });

        carousel.onUnMount();

        expect(removeEventListener).to.have.been.calledWithExactly(
          'resize',
          carousel.updateWindow
        );
      });
    });

    describe('updateWindow', () => {
      it('should update window', () => {
        carousel.state.transitioning = false;
        carousel.update = spy();

        carousel.updateWindow();
        expect(carousel.state.transitioning).to.eq(false);
        expect(carousel.update).to.have.been.called;
      });
    });

    describe('moveNext', () => {
      it('should call slideHandler function with correct slide number', () => {
        carousel.state.currentSlide = 0;
        carousel.slideHandler = spy();

        carousel.moveNext();

        expect(carousel.slideHandler).to.have.been.calledWithExactly(1);
      });
    });

    describe('movePrevious', () => {
      it('should call slideHandler function with correct slide number', () => {
        carousel.state.currentSlide = 0;
        carousel.slideHandler = spy();

        carousel.movePrevious();

        expect(carousel.slideHandler).to.have.been.calledWithExactly(-1);
      });
    });

    describe('onTouchStart', () => {
      it('should add listener', () => {
        carousel.state.touchObject;
        const event = {
          stopPropagation: spy(),
          touches: [
            {
              pageX: 0,
              pageY: 5
            }
          ]
        };
        const carouselwrap = {
          addEventListener: spy()
        };
        carousel.set = () => {
          carousel.state.touchObject = result;
        };
        carousel.refs = <any>{ carouselwrap };
        const result = {
          startX: 0,
          startY: 5,
          curX: 0,
          curY: 5
        };

        expect(carouselwrap.addEventListener).to.not.have.been.called;
        carousel.onTouchStart(event as any);
        expect(event.stopPropagation).to.have.been.called;
        expect(carousel.state.touchObject).to.deep.eq(result);
        expect(carouselwrap.addEventListener).to.have.been.calledWithExactly(
          'touchend',
          carousel.onTouchEnd
        );
      });
    });

    describe('onTouchEnd()', () => {
      beforeEach(() => {
        carousel.state.touchObject = {
          startX: 0,
          startY: 5,
          curX: 0,
          curY: 5
        };
      });

      it('should swipe slides if swipe distance is long enough', () => {
        const event = {
          changedTouches: [
            {
              pageX: 30,
              pageY: 15
            }
          ]
        };
        const touch = {
          startX: 0,
          startY: 5,
          curX: 30,
          curY: 15
        };
        carousel.swipeSlides = spy();
        const carouselwrap = {
          removeEventListener: spy()
        };
        carousel.refs = <any>{ carouselwrap };

        carousel.onTouchEnd(event as any);

        expect(carousel.swipeSlides).to.have.been.calledWithExactly(touch);
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly(
          'touchstart',
          carousel.onTouchStart
        );
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly(
          'touchend',
          carousel.onTouchEnd
        );
      });

      it('should not swipe slides if swipe distance is not long enough', () => {
        const event = {
          changedTouches: [
            {
              pageX: 10,
              pageY: 15
            }
          ]
        };
        const touch = {
          startX: 0,
          startY: 5,
          curX: 10,
          curY: 15
        };
        carousel.swipeSlides = spy();
        const carouselwrap = {
          removeEventListener: spy()
        };
        carousel.refs = <any>{ carouselwrap };

        carousel.onTouchEnd(event as any);

        expect(carousel.swipeSlides).to.not.have.been.calledWithExactly(touch);
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly(
          'touchstart',
          carousel.onTouchStart
        );
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly(
          'touchend',
          carousel.onTouchEnd
        );
      });
    });

    describe('slideHandler()', () => {
      it('should go to the specific slide when threshold is not hit ', () => {
        carousel.state.currentSlide = 0;
        carousel.state.transitioning = false;
        const slide = 1;
        const track = <any>{ addEventListener: spy(), removeEventListener: spy() };
        carousel.refs = <any>{ track };
        carousel.update = spy();

        carousel.slideHandler(slide);

        expect(carousel.state.currentSlide).to.eq(slide);
        expect(carousel.state.transitioning).to.eq(true);
        expect(carousel.update).to.be.calledOnce;
        track.addEventListener.args[0][1]();
        expect(track.addEventListener).to.have.been.calledWith('transitionend');
        expect(track.removeEventListener).to.have.been.calledWith('transitionend');
        expect(carousel.state.transitioning).to.eq(false);
        expect(carousel.update).to.be.calledTwice;
      });

      describe('should reset to non-cloned slide when cloned slides are visible', () => {
        let clock;
        beforeEach(() => {
          carousel.state.transitioning = false;
          carousel.props.settings.slidesToShow = undefined;
          carousel.props.settings.slidesToScroll = undefined;
          const track = <any>{ addEventListener: spy() };
          carousel.refs = <any>{ track };
          carousel.update = spy();
          clock = sinon.useFakeTimers();
        });

        afterEach(() => {
          clock.restore();
        });

        it('should reset slide when scrolling one slide to the next', () => {
          carousel.props.settings.slidesToShow = 3;
          carousel.props.settings.slidesToScroll = 1;
          carousel.state.currentSlide = 9;
          const slide = 10;

          carousel.slideHandler(slide);

          expect(carousel.state.transitioning).to.eq(true);
          expect(carousel.state.animationEndCallback).to.exist;
          expect(carousel.update).to.be.calledOnce;
          expect(carousel.state.currentSlide).to.eq(10);
          clock.tick(500);
          expect(carousel.state.transitioning).to.eq(false);
          expect(carousel.state.currentSlide).to.eq(0);
          expect(carousel.update).to.be.calledTwice;
          expect(carousel.state.animationEndCallback).does.not.exist;
        });

        it('should reset slide when scrolling three slides to the next', () => {
          carousel.props.settings.slidesToShow = 3;
          carousel.props.settings.slidesToScroll = 3;
          carousel.state.currentSlide = 9;
          const slide = 12;

          carousel.slideHandler(slide);

          expect(carousel.state.transitioning).to.eq(true);
          expect(carousel.state.animationEndCallback).to.exist;
          expect(carousel.update).to.be.calledOnce;
          expect(carousel.state.currentSlide).to.eq(12);
          clock.tick(500);
          expect(carousel.state.transitioning).to.eq(false);
          expect(carousel.state.currentSlide).to.eq(2);
          expect(carousel.update).to.be.calledTwice;
          expect(carousel.state.animationEndCallback).does.not.exist;
        });

        it('should reset slide when scrolling one slide to previous', () => {
          carousel.props.settings.slidesToShow = 3;
          carousel.props.settings.slidesToScroll = 1;
          carousel.state.currentSlide = 0;
          const slide = -1;

          carousel.slideHandler(slide);

          expect(carousel.state.transitioning).to.eq(true);
          expect(carousel.state.animationEndCallback).to.exist;
          expect(carousel.state.currentSlide).to.eq(-1);
          expect(carousel.update).to.be.calledOnce;
          clock.tick(500);
          expect(carousel.state.transitioning).to.eq(false);
          expect(carousel.state.currentSlide).to.eq(9);
          expect(carousel.update).to.be.calledTwice;
          expect(carousel.state.animationEndCallback).does.not.exist;
        });

        it('should reset slide when scrolling three slides to previous', () => {
          carousel.props.settings.slidesToShow = 3;
          carousel.props.settings.slidesToScroll = 3;
          carousel.state.currentSlide = 1;
          const slide = -2;

          carousel.slideHandler(slide);

          expect(carousel.state.transitioning).to.eq(true);
          expect(carousel.state.animationEndCallback).to.exist;
          expect(carousel.state.currentSlide).to.eq(-2);
          expect(carousel.update).to.be.calledOnce;
          clock.tick(500);
          expect(carousel.state.transitioning).to.eq(false);
          expect(carousel.state.currentSlide).to.eq(8);
          expect(carousel.update).to.be.calledTwice;
          expect(carousel.state.animationEndCallback).does.not.exist;
        });

        it('should reset slide correctly when scrolling back and forth across threshold', () => {
          carousel.props.settings.slidesToShow = 3;
          carousel.props.settings.slidesToScroll = 3;
          carousel.state.currentSlide = 1;
          const slide1 = -2;
          const slide2 = 11;
          const slide3 = 4;
          const slide4 = 7;
          const slide5 = 10;

          carousel.slideHandler(slide1);

          expect(carousel.state.transitioning).to.eq(true);
          expect(carousel.state.animationEndCallback).to.exist;
          expect(carousel.state.currentSlide).to.eq(-2);
          expect(carousel.update).to.be.calledOnce;
          clock.tick(500);
          expect(carousel.state.transitioning).to.eq(false);
          expect(carousel.state.currentSlide).to.eq(8);
          expect(carousel.update).to.be.calledTwice;
          expect(carousel.state.animationEndCallback).does.not.exist;

          carousel.slideHandler(slide2);

          expect(carousel.state.currentSlide).to.eq(11);
          clock.tick(500);
          expect(carousel.state.currentSlide).to.eq(1);

          carousel.slideHandler(slide3);

          const timeout1 = setTimeout(() => {
            expect(carousel.state.currentSlide).to.eq(4);
          }, 500)
          clearTimeout(timeout1);

          carousel.slideHandler(slide4);

          const timeout2 = setTimeout(() => {
            expect(carousel.state.currentSlide).to.eq(7);
          }, 500)
          clearTimeout(timeout2);

          carousel.slideHandler(slide5);

          const timeout3 = setTimeout(() => {
            expect(carousel.state.currentSlide).to.eq(10);
            expect(carousel.state.currentSlide).to.eq(0);
          }, 500)
          clearTimeout(timeout3);
        });
      })
    });

    describe('cloneItems()', () => {
      it('should return if no items are passed from porps', () => {
        carousel.props.items = undefined;
        carousel.cloneItems();

        const slidesToShow = spy();

        expect(slidesToShow).to.not.have.been.called;
      });

      it('should clone items', () => {
        const items = carousel.cloneItems();

        expect(items.length).to.eq(12);
        expect(items[0]).to.include({ content: 'test9' });
        expect(items[1]).to.include({ content: 'test0' });
        expect(items[10]).to.include({ content: 'test9' });
        expect(items[11]).to.include({ content: 'test0' });

        expect(items[0]['data-index']).to.eq(9);
        expect(items[1]['data-index']).to.eq(0);
        expect(items[10]['data-index']).to.eq(9);
        expect(items[11]['data-index']).to.eq(0);
      });
    });

    describe('dotHandler()', () => {
      it('should call slideHandler function', () => {
        const fakeLi = document.createElement('li');
        fakeLi.getAttribute = spy();
        const e: any = { target: fakeLi, preventDefault: spy() };
        carousel.slideHandler = spy();

        carousel.dotHandler(e);

        expect(fakeLi.getAttribute).to.have.been.calledWith('data-index-to-go');
        expect(carousel.slideHandler).to.have.been.called;
      });
    });

    describe('slideStyle()', () => {
      it('should return slide sty(le', () => {
        const width = 100;
        stub(carousel, 'getSlideWidth').returns(width);

        const style = carousel.slideStyle();
        const result = {
          width: `${width}px`,
        };
        expect(style).to.deep.eq(result);
      });
    });

    describe('trackStyle()', () => {
      it('should return when clone items function returns nothing', () => {
        carousel.props.items = ['a'];
        stub(carousel, 'cloneItems').returns(undefined);
        carousel.getStaticTrackStyle = spy();

        carousel.trackStyle();

        expect(carousel.getStaticTrackStyle).to.not.have.been.called;
      });

      it('should return when items are not passed in from props', () => {
        carousel.props.items = undefined;
        stub(carousel, 'cloneItems').returns({ content: 'test' });
        carousel.getStaticTrackStyle = spy();

        carousel.trackStyle();

        expect(carousel.getStaticTrackStyle).to.not.have.been.called;
      });

      it('should not allow transition when it is set to false', () => {
        carousel.state.transitioning = false;
        stub(carousel, 'cloneItems').returns({ content: 'test' });
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        const result = carousel.trackStyle();

        expect(result).to.deep.eq({
          a: 'b',
          '-webkit-transition': '',
          transition: '',
          'ms-transition': ''
        });
      });

      it('should return transition style if transition is allowed', () => {
        carousel.state.transitioning = true;
        const style = {
          a: 'b',
          '-webkit-transition': '500ms ease',
          transition: '500ms ease',
          'ms-transition': '500ms ease'
        };
        stub(carousel, 'cloneItems').returns({ content: 'test' });
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        const result = carousel.trackStyle();

        expect(result).to.deep.eq(style);
      });

      it('should fall back to default settings if no speed is provided', () => {
        delete carousel.props.settings.speed;
        carousel.state.transitioning = true;
        const style = {
          a: 'b',
          '-webkit-transition': '800ms ease',
          transition: '800ms ease',
          'ms-transition': '800ms ease'
        };
        stub(carousel, 'cloneItems').returns({ content: 'test' });
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        const result = carousel.trackStyle();

        expect(result).to.deep.eq(style);
      });
    });

    describe('getStaticTrackStyle', () => {
      it('should return style', () => {
        const { items } = carousel.props;
        const clonedItems = [items[2], ...items, items[0]];
        const width = 100;
        const trackWidth = 1200;
        const pos = 500;
        const tfm = `translate3d(-${pos}px, 0px, 0px)`;
        const result = {
          transform: tfm,
          '-webkit-transform': tfm,
          '-ms-transform': tfm,
          width: `${trackWidth}px`
        };

        stub(carousel, 'cloneItems').returns(clonedItems);
        stub(carousel, 'getSlideWidth').returns(width);
        stub(carousel, 'calcPos').returns(500);

        const style = carousel.getStaticTrackStyle();

        expect(style).to.deep.eq(result);
      });
    });

    describe('getDots()', () => {
      it('should return when no items are passed down', () => {
        carousel.props.items = undefined;

        const result = carousel.getDots();

        expect(result).to.deep.eq([]);
      });

      it('should return when items is empty array', () => {
        carousel.props.items = [];

        const result = carousel.getDots();

        expect(result).to.deep.eq([]);
      });

      it('should get correct number of dots', () => {
        const dots = Array(10).fill('dot');
        const results = carousel.getDots();

        expect(results).to.deep.eq(dots);
      });

      it('should get correct number of dots when slides to scroll and to show are more than one', () => {
        carousel.props.settings.slidesToScroll = 4;
        carousel.props.settings.slidesToShow = 4;

        const dots = Array(3).fill('dot');
        const results = carousel.getDots();

        expect(results).to.deep.eq(dots);
      });

      it('should get correct number of dots when slides to show are more than one', () => {
        carousel.props.settings.slidesToScroll = 1;
        carousel.props.settings.slidesToShow = 3;

        const dots = Array(10).fill('dot');
        const results = carousel.getDots();

        expect(results).to.deep.eq(dots);
      });
    });

    describe('dotClassName()', () => {
      it('should return active class name when dot is active', () => {
        carousel.state.currentSlide = 1;
        const active = 'active';
        const inactive = 'inactive';

        const style = carousel.dotClassName(0);
        expect(style).to.deep.eq(inactive);
        const style1 = carousel.dotClassName(1);
        expect(style1).to.deep.eq(active);
        const style2 = carousel.dotClassName(2);
        expect(style2).to.deep.eq(inactive);
      });

      it('should return correct class names when slides to show and to scroll are more than one', () => {
        carousel.props.settings.slidesToScroll = 3;
        carousel.props.settings.slidesToShow = 3;
        carousel.state.currentSlide = 3;
        const active = 'active';
        const inactive = 'inactive';

        const style = carousel.dotClassName(0);
        expect(style).to.deep.eq(inactive);
        const style1 = carousel.dotClassName(1);
        expect(style1).to.deep.eq(active);
        const style2 = carousel.dotClassName(2);
        expect(style2).to.deep.eq(inactive);
      });

      it('should return correct class names when slides to show are more than one', () => {
        carousel.props.settings.slidesToScroll = 1;
        carousel.props.settings.slidesToShow = 3;
        carousel.state.currentSlide = 3;
        const active = 'active';
        const inactive = 'inactive';

        const style = carousel.dotClassName(2);
        expect(style).to.deep.eq(inactive);
        const style1 = carousel.dotClassName(3);
        expect(style1).to.deep.eq(active);
        const style2 = carousel.dotClassName(4);
        expect(style2).to.deep.eq(inactive);
      });
    });

    describe('swipeSlides()', () => {
      it('should move next when swiping left with an angle between 315 and 360', () => {
        const touchObj = { startX: 0, startY: 0, curX: -20, curY: 4 };
        stub(carousel, 'moveNext');
        stub(carousel, 'movePrevious');

        const direction = calSwipeDirection(touchObj);
        expect(direction).to.eq('left');

        carousel.swipeSlides(touchObj);

        expect(carousel.moveNext).to.have.been.called;
        expect(carousel.movePrevious).to.not.have.been.called;
      });

      it('should move next when swiping left with an angle between 0 and 45', () => {
        stub(carousel, 'moveNext');
        stub(carousel, 'movePrevious');

        const touchObj2 = { startX: 0, startY: 0, curX: -20, curY: -10 };
        const direction = calSwipeDirection(touchObj2);
        expect(direction).to.eq('left');

        carousel.swipeSlides(touchObj2);
        expect(carousel.moveNext).to.have.been.called;
        expect(carousel.movePrevious).to.not.have.been.called;
      });

      it('should move previous when swiping right with an angle between 135 and 225', () => {
        stub(carousel, 'moveNext');
        stub(carousel, 'movePrevious');

        const touchObj = { startX: 0, startY: 0, curX: 20, curY: 10 };
        const direction = calSwipeDirection(touchObj);
        expect(direction).to.eq('right');

        carousel.swipeSlides(touchObj);
        expect(carousel.moveNext).to.not.have.been.called;
        expect(carousel.movePrevious).to.have.been.called;
      });
    });

    describe('getSlideWidth()', () => {
      it('should return slide width', () => {
        const width = 500;
        const carouselwrap: any = { offsetWidth: width };
        let track;
        carousel.refs = { carouselwrap, track };

        const result = carousel.getSlideWidth();
        expect(result).to.eq(width);
      });

      it('should not return anything if carousel width is not accessible', () => {
        const carouselwrap: any = { offsetWidth: undefined };
        let track;
        carousel.refs = { carouselwrap, track };

        const result = carousel.getSlideWidth();
        expect(result).to.be.undefined;
      });
    });

    describe('calcPos()', () => {
      it('should return correct position value', () => {
        const currentSlide = 2;
        const moveDistance = 100;

        const pos = carousel.calcPos(currentSlide, moveDistance);

        expect(pos).to.eq(300);
      });
    });

    describe('calSwipeDirection()', () => {
      it('should return correct direction', () => {
        const touchObj1 = { startX: 0, startY: 0, curX: 20, curY: 4 };
        const touchObj2 = { startX: 0, startY: 0, curX: -20, curY: 4 };
        const touchObj3 = { startX: 0, startY: 0, curX: 0, curY: 40 };

        const result1 = calSwipeDirection(touchObj1);
        const result2 = calSwipeDirection(touchObj2);
        const result3 = calSwipeDirection(touchObj3);

        expect(result1).to.eq('right');
        expect(result2).to.eq('left');
        expect(result3).to.be.undefined;
      });
    });
  });
});
