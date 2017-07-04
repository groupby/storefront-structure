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

      it('should set initial maxOffset to 0', () => {
        expect(carousel.state.maxOffset).to.eq(0);
      });

      it('should set initial pageSize to 0', () => {
        expect(carousel.state.pageSize).to.eq(0);
      });
    });

    describe('onMount()', () => {
    });
  });

  describe('calculateAttributes()', () => {
    let carouselSet;
    let getComputedStyle;
    let list;

    beforeEach(() => {
      const viewport = <any>{ viewport: 'viewport' };
      list = <any>{ list: 'list' };
      carousel.refs = <any>{ list, viewport };
      carouselSet = carousel.set = spy();
      getComputedStyle = stub();
      getComputedStyle.withArgs(viewport).returns({ width: '5px' });
      stub(utils, 'WINDOW').returns({ getComputedStyle });
    });

    it('should calcuate pageSize', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      getComputedStyle.withArgs(list).returns({ width: '14px' });

      carousel.calculateAttributes();

      expect(carouselSet).to.be.calledWithMatch({ pageSize: 2 });
    });

    it('should calculate maxOffset for list length divisible by page size', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      getComputedStyle.withArgs(list).returns({ width: '14px' });

      carousel.calculateAttributes();

      expect(carouselSet).to.be.calledWithMatch({ maxOffset: 6 });
    });

    it('should calculate maxOffset for list length not divisible by page size', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6]
      };
      getComputedStyle.withArgs(list).returns({ width: '12px' });

      carousel.calculateAttributes();

      expect(carouselSet).to.be.calledWithMatch({ maxOffset: 4 });
    });
  });

  describe('onClickPrev()', () => {
    let carouselSet;

    beforeEach(() => {
      carouselSet = carousel.set = spy();
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
    });

    it('should go to the previous page', () => {
      carousel.state = <any>{
        offset: 4,
        maxOffset: 6,
        pageSize: 2
      };

      carousel.onClickPrev();

      expect(carouselSet).to.be.calledWith({ offset: 2 });
    });

    it('should not set offset less than 0', () => {
      carousel.state = <any>{
        offset: 1,
        maxOffset: 6,
        pageSize: 2
      };

      carousel.onClickPrev();

      expect(carouselSet).to.be.calledWith({ offset: 0 });
    });
  });

  describe('onClickNext()', () => {
    let carouselSet;

    beforeEach(() => {
      carouselSet = carousel.set = spy();
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
    });

    it('should go to the next page', () => {
      carousel.state = <any>{
        offset: 0,
        maxOffset: 6,
        pageSize: 2
      };

      carousel.onClickNext();

      expect(carouselSet).to.be.calledWith({ offset: 2 });
    });

    it('should not exceed the maxOffset', () => {
      carousel.state = <any>{
        offset: 5,
        maxOffset: 6,
        pageSize: 2
      };

      carousel.onClickNext();

      expect(carouselSet).to.be.calledWith({ offset: 6 });
    });
  });
});
