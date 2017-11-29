import { utils } from '@storefront/core';
import * as sinon from 'sinon';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {

  describe('settings', () => {
    it('should default to default settings if no settings are passed in', () => {
      const carousel = new Carousel();

      expect(carousel.props.speed).to.eq(0);
      expect(carousel.props.slidesToScroll).to.eq(1);
      expect(carousel.props.slidesToShow).to.eq(1);
    });
  });

  describe('functions', () => {
    let carousel: Carousel;
    beforeEach(() => {
      carousel = new Carousel();
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
    });

    describe('onMount()', () => {
      it('should add event listener for window resize', () => {
        const addEventListener = spy();
        stub(utils, 'WINDOW').returns({ addEventListener });

        carousel.onMount();

        expect(addEventListener).to.be.calledWithExactly('resize', carousel.update);
      });
    });

    describe('onUpdate()', () => {
      it('should add cloned items to state', () => {
        const clone = carousel.cloneItems = spy();

        carousel.onUpdate();

        expect(clone).to.be.called;
      });
    });

    describe('onUnmount()', () => {
      it('should add event listener for window resize', () => {
        const removeEventListener = spy();
        stub(utils, 'WINDOW').returns({ removeEventListener });

        carousel.onUnmount();

        expect(removeEventListener).to.be.calledWithExactly('resize', carousel.update);
      });
    });

    describe('moveNext', () => {
      it('should call slideHandler function with correct slide number', () => {
        carousel.state.currentSlide = 0;
        const slideHandler = carousel.slideHandler = spy();

        carousel.moveNext();

        expect(slideHandler).to.be.calledWithExactly(1);
      });
    });

    describe('movePrevious', () => {
      it('should call slideHandler function with correct slide number', () => {
        carousel.state.currentSlide = 0;
        const slideHandler = carousel.slideHandler = spy();

        carousel.movePrevious();

        expect(slideHandler).to.be.calledWithExactly(-1);
      });
    });

    describe('shouldSwipeToNext()', () => {
      it('should move next when swiping left with an angle between 315 and 360', () => {
        const direction = Carousel.shouldSwipeToNext({ startX: 0, startY: 0 }, -25, 4);

        expect(direction).to.be.true;
      });

      it('should move next when swiping left with an angle between 0 and 45', () => {
        const direction = Carousel.shouldSwipeToNext({ startX: 0, startY: 0 }, -25, -10);

        expect(direction).to.be.true;
      });

      it('should move previous when swiping right with an angle between 135 and 225', () => {
        const direction = Carousel.shouldSwipeToNext({ startX: 0, startY: 0 }, 25, 10);

        expect(direction).to.be.false;
      });

      it('should not return anything if angle is between 45 to 135 or between225 and 315', () => {
        const direction = Carousel.shouldSwipeToNext({ startX: 0, startY: 0 }, 0, 100);

        expect(direction).to.be.null;
      });
    });

    describe('onTouchStart()', () => {
      it('should add listener', () => {
        const addEventListener = spy();
        const event = {
          touches: [{ pageX: 0, pageY: 5 }],
          target: {
            addEventListener,
          }
        };
        const set = carousel.set = spy();

        carousel.onTouchStart(<any>event);

        expect(set).to.be.calledWithExactly({ touchObject: { startX: 0, startY: 5 } });
        expect(addEventListener).to.be.calledWithExactly('touchend', carousel.onTouchEnd);
      });
    });

    describe('onTouchEnd()', () => {
      beforeEach(() => carousel.state.touchObject = { startX: 0, startY: 5 });

      it('should swipe to next slides if swipe distance is long enough', () => {
        const removeEventListener = spy();
        const event = {
          changedTouches: [{ pageX: 30, pageY: 15 }],
          target: { removeEventListener }
        };
        const shouldSwipeToNext = stub(Carousel, 'shouldSwipeToNext').returns(true);
        const next = carousel.moveNext = spy();

        carousel.onTouchEnd(<any>event);

        expect(shouldSwipeToNext).to.be.calledWithExactly({ startX: 0, startY: 5 }, 30, 15);
        expect(next).to.be.called;
        expect(removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
        expect(removeEventListener).to.be.calledWithExactly('touchend', carousel.onTouchEnd);
      });

      it('should swipe to previous slides if swipe distance is long enough', () => {
        const removeEventListener = spy();
        const event = {
          changedTouches: [{ pageX: -40, pageY: 15 }],
          target: { removeEventListener }
        };
        const shouldSwipeToNext = stub(Carousel, 'shouldSwipeToNext').returns(false);
        const previous = carousel.movePrevious = spy();

        carousel.onTouchEnd(<any>event);

        expect(shouldSwipeToNext).to.be.calledWithExactly({ startX: 0, startY: 5 }, -40, 15);
        expect(previous).to.be.called;
        expect(removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
      });

      it('should not swipe slides if swipe distance is not long enough', () => {
        const removeEventListener = spy();
        const event = {
          changedTouches: [{ pageX: 10, pageY: 15 }],
          target: { removeEventListener }
        };
        const next = carousel.moveNext = spy();
        const previous = carousel.movePrevious = spy();
        stub(Carousel, 'shouldSwipeToNext').returns(false);

        carousel.onTouchEnd(<any>event);

        expect(previous).to.not.be.called;
        expect(next).to.not.be.called;
        expect(removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
        expect(removeEventListener).to.be.calledWithExactly('touchend', carousel.onTouchEnd);
      });
    });

    describe('slideHandler()', () => {
      it('should simply set slide number if speed is 0', () => {
        const reset = carousel.resetCurrentSlideNum = spy();
        const update = carousel.set = spy();

        carousel.slideHandler(-1);

        expect(reset).to.be.calledWithExactly(0, -1, 10);
        expect(update).to.not.be.called;
      });

      it('should go to the specific slide when threshold is not hit and speed is not 0', () => {
        const slide = 1;
        const addEventListener = spy();
        carousel.props.speed = 200;
        carousel.refs = <any>{ track: { addEventListener } };
        carousel.set = spy();
        carousel.disableTransition = spy();

        carousel.slideHandler(slide);

        expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        expect(carousel.animationEndCallback).to.not.exist;
        // tslint:disable-next-line:max-line-length
        expect(addEventListener.getCall(0)).to.be.calledWithExactly('transitionend', carousel.disableTransition, false);
      });

      describe('should reset to non-cloned slide when cloned slides are visible if speed is not 0', () => {
        let clock;
        let addEventListener;
        let set;
        let reset;

        beforeEach(() => {
          carousel.props.speed = 100;
          set = carousel.set = spy();
          reset = carousel.resetToRealSlide = spy();
          addEventListener = spy();
          clock = sinon.useFakeTimers();
          carousel.refs = <any>{ track: { addEventListener } };
        });

        it('should be on edge', () => {
          carousel.props.slidesToShow = 3;
          carousel.props.slidesToScroll = 1;
          carousel.state.currentSlide = 9;

          carousel.slideHandler(10);
          // tslint:disable-next-line:max-line-length
          expect(addEventListener.getCall(0)).to.be.calledWithExactly('transitionend', carousel.disableTransition, false);
          expect(reset).not.to.be.called;

          clock.tick(100);

          expect(reset).to.be.calledWithExactly(9, 10, 10);
          expect(carousel.animationEndCallback).to.exist;
          expect(set).to.be.calledWithExactly({ currentSlide: 10, transitioning: true });
        });

        it('should be on edge', () => {
          carousel.props.slidesToShow = 3;
          carousel.props.slidesToScroll = 1;
          carousel.state.currentSlide = 0;

          carousel.slideHandler(-1);

          expect(carousel.resetToRealSlide).not.to.be.called;

          clock.tick(100);

          expect(reset).to.be.calledWithExactly(0, -1, 10);
          expect(carousel.animationEndCallback).to.exist;
          expect(set).to.be.calledWithExactly({ currentSlide: -1, transitioning: true });
        });

        it('should not do anything if it is on edge and transitioning', () => {
          carousel.props.slidesToShow = 3;
          carousel.props.slidesToScroll = 1;
          carousel.state.currentSlide = 0;
          carousel.state.transitioning = true;

          carousel.slideHandler(-1);
          clock.tick(100);

          expect(reset).not.to.be.called;
          expect(carousel.animationEndCallback).to.be.null;
        });
      });
    });

    describe('resetToRealSlide()', () => {
      it('should reset slide when scrolling three slides to the next', () => {
        const reset = carousel.resetCurrentSlideNum = spy();
        const set = carousel.set = spy();

        carousel.resetToRealSlide(9, 12, 10);

        expect(set).to.be.calledWithExactly({ transitioning: false });
        expect(carousel.animationEndCallback).does.not.exist;
        expect(reset).to.be.calledWithExactly(9, 12, 10);
      });
    });

    describe('resetCurrentSlideNum()', () => {
      it('should reset slide when scrolling three slides to next', () => {
        const set = carousel.set = spy();

        carousel.resetCurrentSlideNum(9, 12, 10);

        expect(set).to.be.calledWithExactly({ currentSlide: 2 });
      });

      it('should reset slide when scrolling three slides to previous', () => {
        const set = carousel.set = spy();

        carousel.resetCurrentSlideNum(0, -3, 10);

        expect(set).to.be.calledWithExactly({ currentSlide: 7 });
      });
    });

    describe('disableTransition()', () => {
      it('remove event listener and set transition to false', () => {
        const removeEventListener = spy();
        const track = { removeEventListener };
        carousel.refs = <any>{ track };
        const set = carousel.set = spy();

        carousel.disableTransition();

        expect(removeEventListener).to.be.calledWithExactly('transitionend', carousel.disableTransition, false);
        expect(set).to.be.calledWithExactly({ transitioning: false });
      });
    });

    describe('cloneItems()', () => {
      it('should clone items', () => {
        const items = carousel.cloneItems();

        expect(items.length).to.eq(12);
        expect(items[0]).to.include({ content: 'test9' });
        expect(items[1]).to.include({ content: 'test0' });
        expect(items[10]).to.include({ content: 'test9' });
        expect(items[11]).to.include({ content: 'test0' });

        expect(items[0]['data-index']).to.eq(-10);
        expect(items[1]['data-index']).to.eq(0);
        expect(items[10]['data-index']).to.eq(9);
        expect(items[11]['data-index']).to.eq(0);
      });
    });

    describe('trackStyle()', () => {
      it('should not allow transition when speed is 0', () => {
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        expect(carousel.trackStyle()).to.eql({ a: 'b' });
      });

      it('should return transition style if transition is allowed', () => {
        const style = {
          a: 'b',
          '-webkit-transition': '500ms ease',
          transition: '500ms ease',
          '-ms-transition': '500ms ease'
        };
        carousel.state.transitioning = true;
        carousel.props.speed = 500;
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        expect(carousel.trackStyle()).to.eql(style);
      });
    });

    describe('getStaticTrackStyle', () => {
      it('should return style', () => {
        const width = 100;
        const trackWidth = 1200;
        const pos = 500;
        const transform = `translateX(-${pos}px)`;
        const result = {
          transform,
          '-webkit-transform': transform,
          '-ms-transform': transform,
          width: `${trackWidth}px`
        };
        carousel.getSlideWidth = () => width;
        stub(Carousel, 'calculatePosition').returns(500);

        expect(carousel.getStaticTrackStyle()).to.eql(result);
      });
    });

    describe('getSlideWidth()', () => {
      it('should return slide width', () => {
        const offsetWidth = 500;
        const wrapper = { offsetWidth: 500 };
        carousel.refs = <any>{ wrapper };

        expect(carousel.getSlideWidth()).to.eq(offsetWidth);
      });
    });

    describe('calculatePosition()', () => {
      it('should return correct position value', () =>
        expect(Carousel.calculatePosition(2, 100, 2)).to.eq(500)
      );
    });
  });
});
