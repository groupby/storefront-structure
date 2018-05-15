import Swatch from '../../src/swatch';
import suite from './_suite';

suite('Swatch', ({ expect, spy, itShouldProvideAlias }) => {
  let swatch: Swatch;

  beforeEach(() => (swatch = new Swatch()));

  itShouldProvideAlias(Swatch, 'swatch');
});
