import Tooltip from '../../src/tooltip';
import suite from './_suite';

suite('Tooltip', ({ expect, spy }) => {
  let tooltip: Tooltip;

  beforeEach(() => tooltip = new Tooltip());

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial values', () => {
        expect(tooltip.props).to.eql({ orientation: 'above' });
      });
    });
  });
});
