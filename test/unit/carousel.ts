import { utils } from '@storefront/core';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub }) => {
  let carousel: Carousel;

  beforeEach(() => carousel = new Carousel());

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default values', () => {
        expect(carousel.props).to.eql({
          settings: {
            speed: 800
          }
        });
      });
    });
  });

  describe('onMount()', () => {


    it('should update slide width', () => {
      carousel.onMount();

      expect(carousel.getDots).to.be.called;
    });
  });

  describe('swipeLeft', () => {
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

      carousel.swipeLeft({} as any);
      expect(touchStartHandler).to.be.ok;
      expect(touchMoveHandler).to.be.ok;
      expect(touchEndHandler).to.be.ok;

      // simulate user touch event
      touchStartHandler();

      expect(touchStartStub).to.have.been.called;

    });
  });
});

