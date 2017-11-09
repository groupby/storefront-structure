import { utils } from '@storefront/core';
import Carousel, { calSwipeDirection } from '../../src/carousel';
import suite from './_suite';

suite.only('Carousel', ({ expect, spy, stub }) => {
  let carousel: Carousel;
  let DEFAULT_SETTINGS;

  describe('settings', () => {
    before(() => {
      carousel = new Carousel();
      DEFAULT_SETTINGS = {
        transition: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
    });

    it('should default to default settings if no settings are passed in', () => {
      expect(carousel.props.settings).to.deep.eq(DEFAULT_SETTINGS);
    });
  });

  describe('functions', () => {
    beforeEach(() => {
      carousel = new Carousel();
      DEFAULT_SETTINGS = {
        transition: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
      carousel.props.items = [{ content: 'test' }, { content: 'test' }, { content: 'test' }];
      carousel.props.settings = {
        speed: 500
      };
    });

    describe('onMount()', () => {

      it('should add event listener for window resize', () => {
        const addEventListener = spy();
        stub(utils, 'WINDOW').returns({ addEventListener });

        carousel.onMount();

        expect(addEventListener).to.have.been.calledWithExactly('resize', carousel.updateWindow);
      });
    });

    describe('onUnMount()', () => {

      it('should add event listener for window resize', () => {
        const removeEventListener = spy();
        stub(utils, 'WINDOW').returns({ removeEventListener });

        carousel.onUnMount();

        expect(removeEventListener).to.have.been.calledWithExactly('resize', carousel.updateWindow);
      });
    });

    describe('updateWindow', () => {

      it('should update window', () => {
        carousel.transitioning = false;
        carousel.update = spy();

        carousel.updateWindow();
        expect(carousel.transitioning).to.eq(false);
        expect(carousel.update).to.have.been.called;
      });
    });

    describe('moveNext', () => {

      it('should call slideHandler function with correct slide number', () => {
        carousel.currentSlide = 0;
        carousel.slideHandler = spy();

        carousel.moveNext();

        expect(carousel.slideHandler).to.have.been.calledWithExactly(1);
      });
    });

    describe('movePrevious', () => {

      it('should call slideHandler function with correct slide number', () => {
        carousel.currentSlide = 0;
        carousel.slideHandler = spy();

        carousel.movePrevious();

        expect(carousel.slideHandler).to.have.been.calledWithExactly(-1);
      });
    });

    describe('onTouchStart', () => {

      it('should add listener', () => {
        carousel.touchObject;
        const event = {
          preventDefault: spy(),
          stopPropagation: spy(),
          touches: [{
            pageX: 0,
            pageY: 5
          }]
        };
        const carouselwrap = {
          addEventListener: spy(),
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

        // expect(event.preventDefault).to.have.been.called;
        expect(event.stopPropagation).to.have.been.called;
        expect(carousel.touchObject).to.deep.eq(result);
        expect(carouselwrap.addEventListener).to.have.been.calledWithExactly('touchend', carousel.onTouchEnd);
      });
    });

    describe('onTouchEnd()', () => {

      it.skip('should remove listener', () => {
        carousel.touchObject = {
          startX: 0,
          startY: 5,
          curX: 0,
          curY: 5
        };

        const event = {
          changedTouches: [{
            pageX: 10,
            pageY: 15
          }]
        };

        carousel.swipeSlides = spy();
        const carouselwrap = {
          removeEventListener: spy()
        };
        carousel.refs = <any>{ carouselwrap };
        const result = {
          startX: 0,
          startY: 5,
          curX: 10,
          curY: 15
        };

        carousel.onTouchEnd(event as any);

        expect(carousel.swipeSlides).to.have.been.calledWithExactly(result);
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly('touchstart', carousel.onTouchStart);
        expect(carouselwrap.removeEventListener).to.have.been.calledWithExactly('touchend', carousel.onTouchEnd);
      });
    });

    describe('slideHandler()', () => {

      it('should go to the specific slide when threshold is not hit ', () => {
        carousel.currentSlide = 0;
        const slide = 1;
        let listener;
        // TODOchange
        const track = {
          addEventListener: spy(),
          removeEventListener: () => {
            listener = spy();
          }
        };
        carousel.update = spy();
        carousel.refs = <any>{ track };
        // const disableTransition = spy();

        carousel.slideHandler(slide);

        expect(carousel.currentSlide).to.eq(slide);
        expect(carousel.refs.track.addEventListener).to.have.been.called;
        expect(carousel.refs.track.removeEventListener).to.not.have.been.called;

        listener();

        expect(carousel.refs.track.removeEventListener).to.have.been.called;
      });

      it('should go to specific slide and reset current slide when threshold is hit as moving next', () => {
        carousel.currentSlide = 2;
        const slide = 3;
        const threshold = carousel.props.items.length;
        let listener;
        const track = {
          addEventListener: spy((name: string, lsnr: Function) => {
            listener = lsnr;
          }),
          removeEventListener: spy()
        };
        carousel.refs = <any>{ track };
        carousel.update = () => undefined;

        carousel.slideHandler(slide);
        listener();

        expect(carousel.currentSlide).to.eq(0);
        expect(carousel.refs.track.addEventListener).to.have.been.called;
        expect(carousel.refs.track.removeEventListener).to.have.been.called;
      });

      it('should go to specific slide and reset current slide when threshold is hit as moving previous', () => {
        carousel.currentSlide = 0;
        const slide = -1;
        const threshold = carousel.props.items.length;
        let listener;
        const track = {
          addEventListener: spy((name: string, lsnr: Function) => {
            listener = lsnr;
          }),
          removeEventListener: spy()
        };
        carousel.refs = <any>{ track };
        carousel.update = () => undefined;

        carousel.slideHandler(slide);
        listener();
        expect(carousel.currentSlide).to.eq(2);
        expect(carousel.refs.track.addEventListener).to.have.been.called;
        expect(carousel.refs.track.removeEventListener).to.have.been.called;
      });
    });

    describe('cloneItems()', () => {

      it('should return if no items are passed from porps', () => {
        carousel.props.items = undefined;
        carousel.cloneItems();

        const slidesToShow = spy();

        expect(slidesToShow).to.not.have.been.called;
      });

      it('should clone items', () => {
        const originalData = { content: 'test' };

        const items = carousel.cloneItems();
        expect(items.length).to.eq(5);
        expect(items[0]).to.include(originalData);
        expect(items[1]).to.include(originalData);
        expect(items[2]).to.include(originalData);
        expect(items[3]).to.include(originalData);
        expect(items[4]).to.include(originalData);

        expect(items[0]['data-index']).to.eq(-1);
        expect(items[1]['data-index']).to.eq(0);
        expect(items[2]['data-index']).to.eq(1);
        expect(items[3]['data-index']).to.eq(2);
        expect(items[4]['data-index']).to.eq(3);
      });

    });

    describe('dotHandler()', () => {

      it('should call slideHandler function', () => {
        const fakeLi = document.createElement('li');
        spy(fakeLi, 'getAttribute');
        const e: any = { target: fakeLi, preventDefault: stub() };
        spy(carousel, 'slideHandler');
        carousel.dotHandler(e);

        expect(fakeLi.getAttribute).to.have.been.calledWith('data-index-to-go');
        expect(carousel.slideHandler).to.have.been.called;
      });

    });

    describe('getSlideStyle()', () => {
      it('should return slide sty(le', () => {
        const width = 100;
        stub(carousel, 'getSlideWidth').returns(width);

        const style = carousel.slideStyle();
        const result = {
          width: `${width}px`,
          outline: 'none',
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
        carousel.transitioning = false;
        stub(carousel, 'getStaticTrackStyle').returns({a: 'b'});

        const result = carousel.trackStyle();

        expect(result).to.deep.eq({
          a: 'b',
          '-webkit-transition': '',
          transition: '',
          'ms-transition': ''
        });
      });

    });

    describe('getStaticTrackStyle', () => {
      it('should return style', () => {
        const { items } = carousel.props;
        const clonedItems = [items[2], ...items, items[0]];
        const width = 100;
        const trackWidth = 500;
        const pos = 500;
        const tfm = `translate3d(-${pos}px, 0px, 0px)`;
        const result = {
          transform: tfm,
          '-webkit-transform': tfm,
          '-ms-transform': tfm,
          width: `${trackWidth}px`,
        };

        stub(carousel, 'cloneItems').returns(clonedItems);
        stub(carousel, 'getSlideWidth').returns(width);
        stub(carousel, 'calcPos').returns(500);

        const style = carousel.getStaticTrackStyle();

        expect(style).to.deep.eq(result);
      });

      // it('should not return style with transition if transition is set to false', () => {
      //   carousel.props.settings.transition = false;
      //   const { items } = carousel.props;
      //   const clonedItems = [items[2], ...items, items[0]];
      //   const width = 100;
      //   const trackWidth = 500;
      //   const pos = 500;
      //   const tfm = `translate3d(-${pos}px, 0px, 0px)`;

      //   stub(carousel, 'cloneItems').returns(clonedItems);
      //   stub(carousel, 'getSlideWidth').returns(width);
      //   stub(carousel, 'calcPos').returns(500);

      //   const result = {
      //     transform: tfm,
      //     '-webkit-transform': tfm,
      //     '-ms-transform': tfm,
      //     width: `${trackWidth}px`,
      //   };

      //   const style = carousel.getStaticTrackStyle();

      //   expect(style).to.deep.eq(result);

      // });
    });

    describe('getDots()', () => {

      it('should return when no items are passed down', () => {
        carousel.props.items = undefined;

        const result = carousel.getDots();

        expect(result).to.eq(undefined);
      });

      it('should get correct number of dots', () => {
        const dots = ['dot', 'dot', 'dot'];
        const results = carousel.getDots();

        expect(results).to.deep.eq(dots);
      });
    });

    describe('dotStyle()', () => {

      it('should return active style when dot is active', () => {
        carousel.currentSlide = 0;
        const active = { 'background-color': 'black' };
        const inactive = {};

        const style = carousel.dotStyle(0);
        expect(style).to.deep.eq(active);
        const style1 = carousel.dotStyle(1);
        expect(style1).to.deep.eq(inactive);
        const style2 = carousel.dotStyle(2);
        expect(style2).to.deep.eq(inactive);
      });
    });

    describe('swipeSlides()', () => {

      it('should move next when swiping left with an angle between 315 and 360', () => {
        stub(carousel, 'moveNext');
        stub(carousel, 'movePrevious');

        const touchObj = { startX: 0, startY: 0, curX: -20, curY: 4 };
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
        let carouselwrap: any = { offsetWidth: width };
        let track: any;

        carousel.refs = {
          carouselwrap,
          track,
        };

        const result = carousel.getSlideWidth();
        expect(result).to.eq(width);
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

        const result1 = calSwipeDirection(touchObj1);
        expect(result1).to.eq('right');

        const result2 = calSwipeDirection(touchObj2);
        expect(result2).to.eq('left');
      });
    });
  });
});
