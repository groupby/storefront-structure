import { utils } from '@storefront/core';
import Carousel, { calSwipeDirection } from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {
  let carousel: Carousel;
  let DEFAULT_SETTINGS;

  beforeEach(() => {
    carousel = new Carousel();
    DEFAULT_SETTINGS = {
      transition: true,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    carousel.props.items = [{ content: 'test' }, { content: 'test' }, { content: 'test' }];
  });

  describe('onMount()', () => {

    // it('should update slide width', () => {
    //   carousel.onMount();

    //   // expect(carousel.getDotsCount).to.be.called;
    // });
  });

  describe.skip('swipeLeft', () => {
    let touchStartHandler: () => void;
    let touchMoveHandler: () => void;
    let touchEndHandler: () => void;

    let touchStartStub: sinon.SinonStub;

    let s: sinon.SinonStub;

    beforeEach(() => {
      s = stub(utils, 'WINDOW', () => ({
        document: {
          addEventListener: (name: string, handler: () => void, useCapture: boolean) => {
            switch (name) {
              case 'touchstart':
                touchStartHandler = handler; break;
              case 'touchmove':
                touchMoveHandler = handler; break;
              case 'touchend':
                touchEndHandler = handler; break;
            }
          }
        }
      }));

      touchStartStub = stub(carousel, 'onTouchStart');
    });

    afterEach(() => {
      s.restore();
    });

    it('should add listener', () => {
      expect(touchStartHandler).not.to.be.ok;
      expect(touchMoveHandler).not.to.be.ok;
      expect(touchEndHandler).not.to.be.ok;

      expect(touchStartStub).not.to.have.been.called;

      carousel.onTouchStart({} as any);
      expect(touchStartHandler).to.be.ok;
      expect(touchMoveHandler).to.be.ok;
      expect(touchEndHandler).to.be.ok;

      // simulate user touch event
      touchStartHandler();

      expect(touchStartStub).to.have.been.called;

    });
  });

  describe('it should set default settings', () => {

    it('should default to default settings if no settings are passed in', () => {

      expect(carousel.props.settings).to.deep.equal(DEFAULT_SETTINGS);
    });
  });

  describe('goToSlide()', () => {

    beforeEach(() => {
      const slidesToShow = 1;
      carousel.props.items = ['', '', ''];
    });

    it('should go to the specific slide when threshold is not hit ', () => {
      carousel.currentSlide = 0;
      const slide = 1;

      const track = {
        addEventListener: spy(),
        removeEventListener: spy()
      };
      carousel.refs = <any>{ track };

      carousel.goToSlide(slide);
      expect(carousel.currentSlide).to.be.equal(slide);
      expect(carousel.refs.track.addEventListener).to.not.have.been.called;
      expect(carousel.refs.track.removeEventListener).to.not.have.been.called;
    });

    it('should go to specific slide and reset current slide when threshold is hit as moving next', () => {
      carousel.currentSlide = 2;
      const slide = 3;
      const threshold = carousel.props.items.length;
      // let resetCurrentSlide = () => {
      //   carousel.currentSlide = carousel.currentSlide - threshold;
      //   console.log('ccc', carousel.currentSlide);
      // };
      let listener;
      const track = {
        addEventListener: spy((name: string, lsnr: Function) => {
          listener = lsnr;
        }),
        removeEventListener: spy()
      };
      carousel.refs = <any>{ track };
      carousel.update = () => undefined;

      carousel.goToSlide(slide);
      listener();

      expect(carousel.currentSlide).to.be.equal(0);
      expect(carousel.refs.track.addEventListener).to.have.been.called;
      expect(carousel.refs.track.removeEventListener).to.have.been.called;
    });

    it('should go to specific slide and reset current slide when threshold is hit as moving previous', () => {
      carousel.currentSlide = 0;
      const slide = -1;
      const threshold = carousel.props.items.length;
      // let resetCurrentSlide = () => {
      //   carousel.currentSlide = carousel.currentSlide - threshold;
      //   console.log('ccc', carousel.currentSlide);
      // };

      const track = {
        addEventListener: spy(),
        removeEventlistener: spy()
      };
      carousel.refs = <any>{ track };

      carousel.goToSlide(slide);
      // expect(carousel.currentSlide).to.be.equal(0);
      expect(carousel.refs.track.addEventListener).to.have.been.called;
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
      const originalData = { ...DEFAULT_SETTINGS[0] };

      const items = carousel.cloneItems();
      expect(items.length).to.be.equal(5);
      expect(items[0]).to.include(originalData);
      expect(items[1]).to.include(originalData);
      expect(items[2]).to.include(originalData);
      expect(items[3]).to.include(originalData);
      expect(items[4]).to.include(originalData);

      expect(items[0]['data-index']).to.be.equal(-1);
      expect(items[1]['data-index']).to.be.equal(0);
      expect(items[2]['data-index']).to.be.equal(1);
      expect(items[3]['data-index']).to.be.equal(2);
      expect(items[4]['data-index']).to.be.equal(3);
    });

  });

  describe('goToDot()', () => {

    it('should call goToSlide function', () => {
      const fakeLi = document.createElement('li');
      spy(fakeLi, 'getAttribute');
      const e: any = { target: fakeLi, preventDefault: stub() };
      spy(carousel, 'goToSlide');
      carousel.goToDot(e);

      expect(fakeLi.getAttribute).to.have.been.calledWith('data-index-to-go');
      expect(carousel.goToSlide).to.have.been.called;
    });

  });

  describe('getSlideStyle()', () => {

    it('should return slide sty(le', () => {
      const width = 100;
      stub(carousel, 'getSlideWidth').returns(width);

      const style = carousel.getSlideStyle();
      const result = {
        width: `${width}px`,
        outline: 'none',
      };
      expect(style).to.deep.equal(result);
    });
  });

  describe('getTrackStyle', () => {

    it('should return when clone items function returns nothing', () => {
      stub(carousel, 'cloneItems').returns(undefined);
      spy(carousel, 'getSlideWidth');
      carousel.getTrackStyle();

      expect(carousel.getSlideWidth).to.not.have.been.called;
    });

    it('should return when items are not passed in from props', () => {
      carousel.props.items = undefined;
      stub(carousel, 'cloneItems').returns({ content: 'test' });

      spy(carousel, 'getSlideWidth');
      carousel.getTrackStyle();

      expect(carousel.getSlideWidth).to.not.have.been.called;
    });

    it('should return style with transition when transition is allowed', () => {
      const { items } = carousel.props;
      const clonedItems = [items[2], ...items, items[0]];
      const width = 100;
      const trackWidth = 700;
      const pos = 500;
      const tfm = `translate3d(-${pos}px, 0px, 0px)`;
      const trsition = DEFAULT_SETTINGS.speed + 'ms ' + 'ease';

      carousel.temporaryNoTransition = false;

      stub(carousel, 'cloneItems').returns(clonedItems);
      stub(carousel, 'getSlideWidth').returns(width);
      stub(carousel, 'calcPos').returns(500);

      const result = {
        transform: tfm,
        '-webkit-transform': tfm,
        '-ms-transform': tfm,
        '-webkit-transition': trsition,
        transition: trsition,
        width: `${trackWidth}px`,
      };

      const style = carousel.getTrackStyle();

      expect(style).to.deep.equal(result);
    });

    it('should return style with no transition when transition is not allowed temporarily', () => {
      const { items } = carousel.props;
      const clonedItems = [items[2], ...items, items[0]];
      const width = 100;
      const trackWidth = 700;
      const pos = 500;
      const tfm = `translate3d(-${pos}px, 0px, 0px)`;

      carousel.temporaryNoTransition = true;

      stub(carousel, 'cloneItems').returns(clonedItems);
      stub(carousel, 'getSlideWidth').returns(width);
      stub(carousel, 'calcPos').returns(500);

      const result = {
        transform: tfm,
        '-webkit-transform': tfm,
        '-ms-transform': tfm,
        width: `${trackWidth}px`,
      };

      const style = carousel.getTrackStyle();

      expect(style).to.deep.equal(result);
    });
  });

  describe('getDots()', () => {

    it('should return when no items are passed down', () => {
      carousel.props.items = undefined;

      const result = carousel.getDots();

      expect(result).to.be.equal(undefined);
    });

    it('should get correct number of dots', () => {
      const dots = ['dot', 'dot', 'dot'];
      const results = carousel.getDots();

      expect(results).to.deep.equal(dots);
    });
  });

  describe('getDotStyle()', () => {

    it('should return active style when dot is active', () => {
      carousel.currentSlide = 0;
      const active = { 'background-color': 'black' };
      const inactive = {};

      const style = carousel.getDotStyle(0);
      expect(style).to.deep.equal(active);
      const style1 = carousel.getDotStyle(1);
      expect(style1).to.deep.equal(inactive);
      const style2 = carousel.getDotStyle(2);
      expect(style2).to.deep.equal(inactive);
    });
  });

  describe('swipeSlides()', () => {

    it('should move next when swiping left', () => {
      spy(carousel, 'moveNext');
      spy(carousel, 'movePrevious');
  
      const touchObj = {startX: 0, startY: 0, curX: -20, curY: 4};
      carousel.swipeSlides(touchObj);
      expect(carousel.moveNext).to.have.been.called;
      expect(carousel.movePrevious).to.not.have.been.called;
    })

    it.skip('should move previous when swiping right', () => {
      spy(carousel, 'moveNext');
      spy(carousel, 'movePrevious');
  
      const touchObj = {startX: 0, startY: 0, curX: 20, curY: 4};
      carousel.swipeSlides(touchObj);
      expect(carousel.moveNext).to.not.have.been.called;
      expect(carousel.movePrevious).to.have.been.called;
    });
  });

  describe('getSlideWidth()' , () => {
   it('should return slide width', () => {
    const width = 500;
    const carouselwrap = document.createElement('div');
    stub(carouselwrap, 'offsetWidth').returns(width);
    const track = document.createElement('div');
    const dots = document.createElement('div');
    const slide = document.createElement('div');
    
    carousel.refs = {
      carouselwrap,
      track,
      dots,
      slide
    };
    // stub(carousel.refs.carouselwrap, 'offsetWidth').returns(width);

    const result = carousel.getSlideWidth();
    expect(result).to.be.equal(width);
   })
  });
});
