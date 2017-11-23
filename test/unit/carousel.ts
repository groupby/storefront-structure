import { utils } from '@storefront/core';
import * as sinon from 'sinon';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {
  let carousel: Carousel;
  let DEFAULT_SETTINGS;

  describe('settings', () => {
    it('should default to default settings if no settings are passed in', () => {
      carousel = new Carousel();
      const settings = {
        speed: 0,
        slidesToShow: 1,
        slidesToScroll: 1
      };

      expect(carousel.state.settings).to.deep.eq(settings);
    });
  });

  describe('functions', () => {
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

    describe('init()', () => {
      it('should initialize state settings', () => {
        carousel.props.settings = { speed: 500 };
        carousel.init();
        expect(carousel.state.settings).to.deep.eq({ speed: 500, slidesToScroll: 1, slidesToShow: 1 });
      });
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

    describe('onUnMount()', () => {
      it('should add event listener for window resize', () => {
        const removeEventListener = spy();
        stub(utils, 'WINDOW').returns({ removeEventListener });

        carousel.onUnMount();

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
        expect(direction).to.eq(true);
      });

      it('should move next when swiping left with an angle between 0 and 45', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, -20, -10);
        expect(direction).to.eq(true);
      });

      it('should move previous when swiping right with an angle between 135 and 225', () => {
        const direction = Carousel.isSwipeToNext({ startX: 0, startY: 0 }, 20, 10);
        expect(direction).to.eq(false);
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
          ],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        carousel.set = () => {
          carousel.state.touchObject = result;
        };
        const result = {
          startX: 0,
          startY: 5
        };

        expect(event.target.addEventListener).to.not.be.called;
        carousel.onTouchStart(event as any);
        expect(event.stopPropagation).to.be.called;
        expect(carousel.state.touchObject).to.deep.eq(result);
        expect(event.target.addEventListener).to.be.calledWithExactly(
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
        };
      });

      it('should swipe slides if swipe distance is long enough', () => {
        const event = {
          changedTouches: [
            {
              pageX: 30,
              pageY: 15
            }
          ],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        const s = stub(Carousel, 'isSwipeToNext').returns(true);
        carousel.moveNext = spy();

        carousel.onTouchEnd(event as any);

        expect(Carousel.isSwipeToNext).to.be.calledWithExactly({ startX: 0, startY: 5 }, 30, 15);
        expect(event.target.removeEventListener).to.be.calledWithExactly(
          'touchstart',
          carousel.onTouchStart
        );
        expect(event.target.removeEventListener).to.be.calledWithExactly(
          'touchend',
          carousel.onTouchEnd
        );
        s.restore();
      });

      it('should not swipe slides if swipe distance is not long enough', () => {
        const event = {
          changedTouches: [
            {
              pageX: 10,
              pageY: 15
            }
          ],
          target: {
            addEventListener: spy(),
            removeEventListener: spy()
          }
        };
        Carousel.isSwipeToNext = spy();

        carousel.onTouchEnd(event as any);

        expect(Carousel.isSwipeToNext).to.not.be.called;
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
        carousel.state.settings.speed = 200;
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
        beforeEach(() => {
          carousel.state.settings.speed = 100;
          carousel.set = spy();
        });

        it('should be on edge', () => {
          carousel.state.settings.slidesToShow = 3;
          carousel.state.settings.slidesToScroll = 1;
          carousel.state.currentSlide = 9;
          const slide = 10;

          carousel.slideHandler(slide);

          expect(carousel.animationEndCallback).to.exist;
          expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        });

        it('should be on edge', () => {
          carousel.state.settings.slidesToShow = 3;
          carousel.state.settings.slidesToScroll = 1;
          carousel.state.currentSlide = 0;
          const slide = -1;

          carousel.slideHandler(slide);

          expect(carousel.animationEndCallback).to.exist;
          expect(carousel.set).to.be.calledWithExactly({ currentSlide: slide, transitioning: true });
        });
      });
    });

    describe('resetToRealSlide()', () => {
      it('should reset slide when scrolling three slides to the next', () => {
        carousel.resetCurrentSlideNum = spy();

        carousel.resetToRealSlide(9, 12, 10);

        expect(carousel.state.transitioning).to.eq(false);
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

        const result = carousel.trackStyle();

        expect(result).to.deep.eq({ a: 'b' });
      });

      it('should return transition style if transition is allowed', () => {
        carousel.state.transitioning = true;
        carousel.state.settings.speed = 500;
        const style = {
          a: 'b',
          '-webkit-transition': '500ms ease',
          transition: '500ms ease',
          '-ms-transition': '500ms ease'
        };
        stub(carousel, 'getStaticTrackStyle').returns({ a: 'b' });

        const result = carousel.trackStyle();

        expect(result).to.deep.eq(style);
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

        const style = carousel.getStaticTrackStyle();

        expect(style).to.deep.eq(result);
      });
    });

    describe('getSlideWidth()', () => {
      it('should return slide width', () => {
        const width = 500;
        const wrapper: any = { offsetWidth: width };
        let track;
        carousel.refs = { wrapper, track };

        const result = carousel.getSlideWidth();
        expect(result).to.eq(width);
      });

      it('should not return anything if carousel width is not accessible', () => {
        const wrapper: any = { offsetWidth: undefined };
        let track;
        carousel.refs = { wrapper, track };

        const result = carousel.getSlideWidth();
        expect(result).to.be.undefined;
      });
    });

    describe('calculatePosition()', () => {
      it('should return correct position value', () => {
        const pos = Carousel.calculatePosition(2, 100, 2);
        expect(pos).to.eq(500);
      });
    });

    // describe('dotHandler()', () => {
    //   it('should call slideHandler function', () => {
    //     const fakeLi = document.createElement('li');
    //     fakeLi.getAttribute = spy();
    //     const e: any = { target: fakeLi, preventDefault: spy() };
    //     carousel.slideHandler = spy();

    //     carousel.dotHandler(e);

    //     expect(fakeLi.getAttribute).to.be.calledWith('data-index-to-go');
    //     expect(carousel.slideHandler).to.be.called;
    //   });
    // });

    // describe('slideStyle()', () => {
    //   it('should return slide sty(le', () => {
    //     const width = 100;
    //     stub(carousel, 'getSlideWidth').returns(width);

    //     const style = carousel.slideStyle();
    //     const result = {
    //       width: `${width}px`,
    //     };
    //     expect(style).to.deep.eq(result);
    //   });
    // });

    // describe('getDots()', () => {
    //   it('should return when no items are passed down', () => {
    //     carousel.props.items = undefined;

    //     const result = carousel.getDots();

    //     expect(result).to.deep.eq([]);
    //   });

    //   it('should return when items is empty array', () => {
    //     carousel.props.items = [];

    //     const result = carousel.getDots();

    //     expect(result).to.deep.eq([]);
    //   });

    //   it('should get correct number of dots', () => {
    //     const dots = Array(10).fill('dot');
    //     const results = carousel.getDots();

    //     expect(results).to.deep.eq(dots);
    //   });

    //   it('should get correct number of dots when slides to scroll and to show are more than one', () => {
    //    carousel.state.settings.slidesToScroll = 4;
    //    carousel.state.settings.slidesToShow = 4;

    //     const dots = Array(3).fill('dot');
    //     const results = carousel.getDots();

    //     expect(results).to.deep.eq(dots);
    //   });

    //   it('should get correct number of dots when slides to show are more than one', () => {
    //    carousel.state.settings.slidesToScroll = 1;
    //    carousel.state.settings.slidesToShow = 3;

    //     const dots = Array(10).fill('dot');
    //     const results = carousel.getDots();

    //     expect(results).to.deep.eq(dots);
    //   });
    // });

    // describe('dotClassName()', () => {
    //   it('should return active class name when dot is active', () => {
    //     carousel.state.currentSlide = 1;
    //     const active = 'active';
    //     const inactive = 'inactive';

    //     const style = carousel.dotClassName(0);
    //     expect(style).to.deep.eq(inactive);
    //     const style1 = carousel.dotClassName(1);
    //     expect(style1).to.deep.eq(active);
    //     const style2 = carousel.dotClassName(2);
    //     expect(style2).to.deep.eq(inactive);
    //   });

    //   it('should return correct class names when slides to show and to scroll are more than one', () => {
    //    carousel.state.settings.slidesToScroll = 3;
    //    carousel.state.settings.slidesToShow = 3;
    //     carousel.state.currentSlide = 3;
    //     const active = 'active';
    //     const inactive = 'inactive';

    //     const style = carousel.dotClassName(0);
    //     expect(style).to.deep.eq(inactive);
    //     const style1 = carousel.dotClassName(1);
    //     expect(style1).to.deep.eq(active);
    //     const style2 = carousel.dotClassName(2);
    //     expect(style2).to.deep.eq(inactive);
    //   });

    //   it('should return correct class names when slides to show are more than one', () => {
    //    carousel.state.settings.slidesToScroll = 1;
    //    carousel.state.settings.slidesToShow = 3;
    //     carousel.state.currentSlide = 3;
    //     const active = 'active';
    //     const inactive = 'inactive';

    //     const style = carousel.dotClassName(2);
    //     expect(style).to.deep.eq(inactive);
    //     const style1 = carousel.dotClassName(3);
    //     expect(style1).to.deep.eq(active);
    //     const style2 = carousel.dotClassName(4);
    //     expect(style2).to.deep.eq(inactive);
    //   });
    // });
  });
});