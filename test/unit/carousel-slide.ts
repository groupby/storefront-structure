import CarouselSlide from '../../src/carousel-slide';
import suite from './_suite';

suite('CarouselSlide', ({ expect, spy }) => {
  let carouselSlide: CarouselSlide;

  beforeEach(() => carouselSlide = new CarouselSlide());

  describe('init()', () => {
    it('should expose the slide and index', () => {
      const itemAlias = 'someAlias';
      const indexAlias = 'someIndex';
      const expose = carouselSlide.expose = spy();
      const item = carouselSlide.slide = { a: 'b' };
      const index = carouselSlide.index = <any>{ c: 'd' };
      carouselSlide.$carousel = <any>{ itemAlias, indexAlias };
      carouselSlide.unexpose = () => null;

      carouselSlide.init();

      expect(expose).to.be.calledWith(itemAlias, item);
      expect(expose).to.be.calledWith(indexAlias, index);
    });

    it('should call unexpose()', () => {
      const unexpose = carouselSlide.unexpose = spy();
      carouselSlide.expose = () => null;
      carouselSlide.$carousel = <any>{};

      carouselSlide.init();

      expect(unexpose).to.be.calledWith('carousel');
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

      expect(updateAlias).to.be.calledWith(itemAlias, slide);
      expect(updateAlias).to.be.calledWith(indexAlias, index);
    });
  });
});
