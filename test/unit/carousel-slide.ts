import CarouselSlide from '../../src/carousel-slide';
import suite from './_suite';

suite('CarouselSlide', ({ expect, spy }) => {
  let carouselSlide: CarouselSlide;

  beforeEach(() => carouselSlide = new CarouselSlide());

  describe('init()', () => {
    it('should expose the slide and index', () => {
      const itemAlias = 'someAlias';
      const indexAlias = 'someIndex';
      const item = carouselSlide.slide = { a: 'b' };
      const index = carouselSlide.index = <any>{ c: 'd' };
      carouselSlide.$carousel = <any>{ itemAlias, indexAlias };
      const expose = carouselSlide.expose = spy();
      const unexpose = carouselSlide.unexpose = spy();

      carouselSlide.init();

      expect(expose).to.be.calledWithExactly(itemAlias, item);
      expect(expose).to.be.calledWithExactly(indexAlias, index);
      expect(unexpose).to.be.calledWithExactly('carousel');
    });
  });

  describe('onUpdate()', () => {
    it('should update item and index aliases', () => {
      const slide = carouselSlide.slide = { a: 'b' };
      const index = carouselSlide.index = 7;
      const itemAlias = carouselSlide.itemAlias = 'myItem';
      const indexAlias = carouselSlide.indexAlias = 'myIndex';
      const updateAlias = carouselSlide.updateAlias = spy();

      carouselSlide.onUpdate();

      expect(updateAlias).to.be.calledWithExactly(itemAlias, slide);
      expect(updateAlias).to.be.calledWithExactly(indexAlias, index);
    });
  });
});
