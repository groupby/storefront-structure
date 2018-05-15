import * as sinon from 'sinon';
import CarouselSlide from '../../src/carousel-slide';
import suite from './_suite';

suite('CarouselSlide', ({ expect, spy }) => {
  let carouselSlide: CarouselSlide;

  beforeEach(() => (carouselSlide = new CarouselSlide()));

  describe('init()', () => {
    it('should expose the slide and index and unexpose carousel', () => {
      const itemAlias = 'someAlias';
      const indexAlias = 'someIndex';
      const slide = { a: 'b' };
      const index = 8;
      const provide = (carouselSlide.provide = spy());
      const state = { slide, index };
      carouselSlide.props = { itemAlias, indexAlias };

      carouselSlide.init();

      expect(provide).to.be.calledWithExactly(itemAlias, sinon.match((cb) => expect(cb(null, state)).to.eq(slide)));
      expect(provide).to.be.calledWithExactly(indexAlias, sinon.match((cb) => expect(cb(null, state)).to.eq(index)));
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updateState()', () => {
      const updateState = (carouselSlide.updateState = spy());

      carouselSlide.onBeforeMount();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState()', () => {
      const updateState = (carouselSlide.updateState = spy());

      carouselSlide.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should call updateState()', () => {
      const slide = (carouselSlide.slide = { a: 'b' });
      const index = (carouselSlide.index = 7);
      carouselSlide.props = { itemAlias: 'myItem', indexAlias: 'myIndex' };
      carouselSlide.state = { c: 'd' } as any;

      carouselSlide.onUpdate();

      expect(carouselSlide.state).to.eql({ c: 'd', slide, index });
    });
  });
});
