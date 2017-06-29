import { utils } from '@storefront/core';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, stub }) => {
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
    it('should exist', () => {
      expect(carousel.onClickPrev).to.be.ok;
    });

    it('should go to the previous page', () => {
      const list = <any>{};
      const viewport = <any>{};
      const getComputedStyle = stub();
      getComputedStyle.withArgs(list).returns({ width: '14px' });
      getComputedStyle.withArgs(viewport).returns({ width: '5px' });
      stub(utils, 'WINDOW').returns({ getComputedStyle });
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      carousel.refs = <any>{ list, viewport };
      carousel.state = <any>{ offset: 4 };

      carousel.onClickPrev();

      expect(carousel.state.offset).to.eq(2);
    });
  });

  describe('onClickNext()', () => {
    it('should exist', () => {
      expect(carousel.onClickNext).to.be.ok;
    });
  });
});
