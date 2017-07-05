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
      expect(carousel.maxOffset).to.eq(0);
      expect(carousel.pageSize).to.eq(0);
    });

    describe('state', () => {
      it('should set inital offset to 0', () => {
        expect(carousel.state.offset).to.eq(0);
      });
    });

    describe('onMount()', () => {
      it('should call calculateAttributes', () => {
        const calculateAttributes = carousel.calculateAttributes = spy();

        carousel.onMount();

        expect(calculateAttributes).to.be.called;
      });
    });

    describe('onUpdate()', () => {
      it('should call calculateAttributes', () => {
        const calculateAttributes = carousel.calculateAttributes = spy();

        carousel.onUpdate();

        expect(calculateAttributes).to.be.called;
      });
    });
  });

  describe('calculateAttributes()', () => {
    let carouselSet;
    let getComputedStyle;
    let listwrapper;

    beforeEach(() => {
      const viewport = <any>{ viewport: 'viewport' };
      listwrapper = <any>{ listwrapper: 'listWrapper' };
      carousel.refs = <any>{ listwrapper , viewport };
      getComputedStyle = stub();
      getComputedStyle.withArgs(viewport).returns({ width: '5px' });
      stub(utils, 'WINDOW').returns({ getComputedStyle });
    });

    it('should calcuate pageSize', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      getComputedStyle.withArgs(listwrapper).returns({ width: '14px' });

      carousel.calculateAttributes();

      expect(carousel.pageSize).to.eq(2);
    });

    it('should calculate maxOffset for list length divisible by page size', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      getComputedStyle.withArgs(listwrapper).returns({ width: '14px' });

      carousel.calculateAttributes();

      expect(carousel.maxOffset).to.eq(6);
    });

    it('should calculate maxOffset for list length not divisible by page size', () => {
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6]
      };
      getComputedStyle.withArgs(listwrapper).returns({ width: '12px' });

      carousel.calculateAttributes();

      expect(carousel.maxOffset).to.eq(4);
    });
  });

  describe('onClickPrev()', () => {
    let carouselSet;

    beforeEach(() => {
      carouselSet = carousel.set = spy();
      carousel.props = <any>{
        items: [1, 2, 3, 4, 5, 6, 7]
      };
      carousel.maxOffset = 6;
      carousel.pageSize = 2;
    });

    it('should go to the previous page', () => {
      carousel.state = <any>{
        offset: 4
      };

      carousel.onClickPrev();

      expect(carouselSet).to.be.calledWith({ offset: 2 });
    });

    it('should not set offset less than 0', () => {
      carousel.state = <any>{
        offset: 1
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
      carousel.maxOffset = 6;
      carousel.pageSize = 2;
    });

    it('should go to the next page', () => {
      carousel.state = <any>{
        offset: 0
      };

      carousel.onClickNext();

      expect(carouselSet).to.be.calledWith({ offset: 2 });
    });

    it('should not exceed the maxOffset', () => {
      carousel.state = <any>{
        offset: 5
      };

      carousel.onClickNext();

      expect(carouselSet).to.be.calledWith({ offset: 6 });
    });
  });
});
