import { utils } from '@storefront/core';
import Carousel from '../../src/carousel';
import suite from './_suite';

const log = require('loglevel');

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
      s = stub(utils,'WINDOW', () => ({
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
      carousel.update = () => null;

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

      expect(fakeLi.getAttribute).to.have.been.called;
      expect(carousel.goToSlide).to.have.been.called;
    });

  });
});
