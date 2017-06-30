import { utils } from '@storefront/core';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, stub, spy }) => {
  let carousel: Carousel;

  beforeEach(() => carousel = new Carousel());

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(carousel.props).to.eql({
        items: [],
        prevIcon: '',
        nextIcon: ''
      });
    });

    describe('state', () => {
      it('should set inital offset to 0', () => {
        expect(carousel.state.offset).to.eq(0);
      });
    });
  });

  describe('onClickPrev()', () => {
    let carouselSet;

    beforeEach(() => {
      const list = <any>{ list: 'list' };
      const viewport = <any>{ viewport: 'viewport' };
      const getComputedStyle = stub();
      getComputedStyle.withArgs(list).returns({ width: '14px' });
      getComputedStyle.withArgs(viewport).returns({ width: '5px' });
      stub(utils, 'WINDOW').returns({ getComputedStyle });
      carouselSet = carousel.set = spy();
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      carousel.refs = <any>{ list, viewport };
    });

    it('should go to the previous page', () => {
      carousel.state = <any>{ offset: 4 };

      carousel.onClickPrev();

      expect(carouselSet).to.be.calledWith({ offset: 2 });
    });

    it('should not set offset less than 0', () => {
      carousel.state = <any>{ offset: 1 };

      carousel.onClickPrev();

      expect(carouselSet).to.be.calledWith({ offset: 0 });
    });
  });

  describe('onClickNext()');
});
