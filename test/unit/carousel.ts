import { utils } from '@storefront/core';
import * as sinon from 'sinon';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {

  describe('settings', () => {
    it('should default to default settings if no settings are passed in', () => {
      const carousel = new Carousel();

      expect(carousel.props.speed).to.eq(0);
      expect(carousel.props.slidestoscroll).to.eq(1);
      expect(carousel.props.slidestoshow).to.eq(1);
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
        carousel.slideHandler = spy();

        carousel.moveNext();

        expect(carousel.slideHandler).to.be.calledWithExactly(1);
      });
    });

    describe('movePrevious', () => {
      it('should call slideHandler function with correct slide number', () => {
        carousel.state.currentSlide = 0;
        carousel.slideHandler = spy();

        carousel.movePrevious();

        expect(carousel.slideHandler).to.be.calledWithExactly(-1);
      });
    });

    describe('isSwipeToNext()', () => {
      it('should move next when swiping left with an angle between 315 and 360', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, -25, 4);
        expect(direction).to.be.true;
      });

      it('should move next when swiping left with an angle between 0 and 45', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, -25, -10);
        expect(direction).to.be.true;
      });

      it('should move previous when swiping right with an angle between 135 and 225', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, 25, 10);
        expect(direction).to.be.false;
      });

      it('should not return anything if angle is between 45 to 135 or between225 and 315', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, 0, 100);
        expect(direction).to.be.null;
      });
    });

    describe('onTouchStart()', () => {
      it('should add listener', () => {
        const event = {
          touches: [{ pageX: 0, pageY: 5 }],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        carousel.set = () => {
          carousel.state.touchObject = result;
        };
        const result = { startX: 0, startY: 5 };

        expect(event.target.addEventListener).to.not.be.called;
        carousel.onTouchStart(event as any);
        expect(carousel.state.touchObject).to.eql(result);
        expect(event.target.addEventListener).to.be.calledWithExactly(
          'touchend',
          carousel.onTouchEnd
        );
      });
    });

    describe('onTouchEnd()', () => {
      beforeEach(() => carousel.state.touchObject = { startX: 0, startY: 5 });

      it('should swipe to next slides if swipe distance is long enough', () => {
        const event = {
          changedTouches: [{ pageX: 30, pageY: 15 }],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        stub(Carousel, 'isSwipeToNext').returns(true);
        carousel.moveNext = spy();
        carousel.movePrevious = spy();

        carousel.onTouchEnd(event as any);

        expect(Carousel.isSwipeToNext).to.be.calledWithExactly({ startX: 0, startY: 5 }, 30, 15);
        expect(carousel.moveNext).to.be.called;
        expect(carousel.movePrevious).not.to.be.called;
        expect(event.target.removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
        expect(event.target.removeEventListener).to.be.calledWithExactly('touchend', carousel.onTouchEnd);
      });

      it('should swipe to previous slides if swipe distance is long enough', () => {
        const event = {
          changedTouches: [{ pageX: -40, pageY: 15 }],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        stub(Carousel, 'isSwipeToNext').returns(false);
        carousel.moveNext = spy();
        carousel.movePrevious = spy();

        carousel.onTouchEnd(event as any);

        expect(Carousel.isSwipeToNext).to.be.calledWithExactly({ startX: 0, startY: 5 }, -40, 15);
        expect(carousel.moveNext).not.to.be.called;
        expect(carousel.movePrevious).to.be.called;
        expect(event.target.removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
      });

      it('should not swipe slides if swipe distance is not long enough', () => {
        const event = {
          changedTouches: [{ pageX: 10, pageY: 15 }],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        stub(Carousel, 'isSwipeToNext').returns(false);
        carousel.moveNext = spy();
        carousel.movePrevious = spy();

        carousel.onTouchEnd(event as any);

        expect(carousel.moveNext).to.not.be.called;
        expect(carousel.movePrevious).to.not.be.called;
        expect(event.target.removeEventListener).to.be.calledWithExactly('touchstart', carousel.onTouchStart);
        expect(event.target.removeEventListener).to.be.calledWithExactly('touchend', carousel.onTouchEnd);
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
        carousel.props.speed = 200;
        const slide = 1;
        const track = <any>{ addEventListener: spy(), removeEventListener: spy() };
        carousel.refs = <any>{ track };
        carousel.set = spy();
        carousel.disableTransition = spy();

        carousel.slideHandler(slide);

        expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        expect(carousel.animationEndCallback).to.not.exist;
        track.addEventListener.args[0][1]();
        // tslint:disable-next-line:max-line-length
        expect(track.addEventListener).to.be.calledWithExactly('transitionend', carousel.disableTransition, false);
      });

      describe('should reset to non-cloned slide when cloned slides are visible if speed is not 0', () => {
        let clock;
        beforeEach(() => {
          carousel.props.speed = 100;
          carousel.set = spy();
          carousel.resetToRealSlide = spy();
          clock = sinon.useFakeTimers();
        });

        it('should be on edge', () => {
          carousel.props.slidestoshow = 3;
          carousel.props.slidestoscroll = 1;
          carousel.state.currentSlide = 9;
          const slide = 10;

          carousel.slideHandler(slide);

          expect(carousel.resetToRealSlide).not.to.be.called;

          clock.tick(100);

          expect(carousel.resetToRealSlide).to.be.calledWithExactly(9, 10, 10);

          expect(carousel.animationEndCallback).to.exist;
          expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        });

        it('should be on edge', () => {
          carousel.props.slidestoshow = 3;
          carousel.props.slidestoscroll = 1;
          carousel.state.currentSlide = 0;
          const slide = -1;

          carousel.slideHandler(slide);

          expect(carousel.resetToRealSlide).not.to.be.called;

          clock.tick(100);

          expect(carousel.resetToRealSlide).to.be.calledWithExactly(0, -1, 10);
          expect(carousel.animationEndCallback).to.exist;
          expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        });

        it('should not do anything if it is on edge and transitioning', () => {
          carousel.props.slidestoshow = 3;
          carousel.props.slidestoscroll = 1;
          carousel.state.currentSlide = 0;
          carousel.state.transitioning = true;
          const track = <any>{ addEventListener: spy(), removeEventListener: spy() };
          carousel.refs = <any>{ track };
          const slide = -1;

          carousel.slideHandler(slide);
          clock.tick(100);

          expect(carousel.resetToRealSlide).not.to.be.called;
          expect(carousel.animationEndCallback).to.be.null;
          expect(track.addEventListener).not.to.be.called;
        });
      });
    });

    describe('resetToRealSlide()', () => {
      it('should reset slide when scrolling three slides to the next', () => {
        carousel.resetCurrentSlideNum = spy();

        carousel.resetToRealSlide(9, 12, 10);

        expect(carousel.state.transitioning).to.be.false;
        expect(carousel.animationEndCallback).does.not.exist;
        expect(carousel.resetCurrentSlideNum).to.be.calledWithExactly(9, 12, 10);
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
        const track = <any>{ removeEventListener: spy() };
        carousel.refs = <any>{ track };
        const set = carousel.set = spy();

        carousel.disableTransition();

        expect(track.removeEventListener).to.be.calledWithExactly('transitionend', carousel.disableTransition, false);
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
        carousel.state.transitioning = true;
        carousel.props.speed = 500;
        const style = {
          a: 'b',
          '-webkit-transition': '500ms ease',
          transition: '500ms ease',
          '-ms-transition': '500ms ease'
        };
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        expect(carousel.trackStyle()).to.eql(style);
      });
    });

    describe('getStaticTrackStyle', () => {
      it('should return style', () => {
        const width = 100;
        const trackWidth = 1200;
        const pos = 500;
        const tfm = `translateX(-${pos}px)`;
        const result = {
          transform: tfm,
          '-webkit-transform': tfm,
          '-ms-transform': tfm,
          width: `${trackWidth}px`
        };
        stub(carousel, 'getSlideWidth').returns(width);
        stub(Carousel, 'calculatePosition').returns(500);

        expect(carousel.getStaticTrackStyle()).to.eql(result);
      });
    });

    describe('getSlideWidth()', () => {
      it('should return slide width', () => {
        const offsetWidth = 500;
        const wrapper: any = { offsetWidth };
        let track;
        carousel.refs = { wrapper, track };

        const result = carousel.getSlideWidth();

        expect(result).to.eq(offsetWidth);
      });
    });

    describe('calculatePosition()', () => {
      it('should return correct position value', () => {
        const pos = Carousel.calculatePosition(2, 100, 2);

        expect(pos).to.eq(500);
      });
    });
  });
});
