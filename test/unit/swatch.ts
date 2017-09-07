import Swatch from '../../src/swatch';
import suite from './_suite';

suite('Swatch', ({ expect, spy }) => {
  let swatch: Swatch;

  beforeEach(() => swatch = new Swatch());

  describe('init()', () => {
    it('should expose props', () => {
      const expose = swatch.expose = spy();
      const props = swatch.props = <any>{ a: 'b' };

      swatch.init();

      expect(expose).to.be.calledWith('swatch', props);
    });
  });
});
