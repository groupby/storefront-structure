import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect }) => {
  let carousel: Carousel;

  beforeEach(() => carousel = new Carousel());

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(carousel.props).to.eql({ items: [] });
    });

    describe('state', () => {
      it('should set inital index to 0', () => {
        expect(carousel.state.index).to.eq(0);
      });
    });
  });
});
