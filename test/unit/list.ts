import List from '../../src/list';
import suite from './_suite';

suite('List', ({ expect, spy, stub }) => {
  let list: List;

  beforeEach(() => list = new List());

  describe('constructor()', () => {
    describe('props', () => {
      describe('shouldRender()', () => {
        it('should return true if no render discriminator', () => {
          expect(list.props.shouldRender({})).to.be.true;
        });

        it('should return result of render discriminator', () => {
          expect(list.props.shouldRender({ shouldRender: () => false })).to.be.false;
          expect(list.props.shouldRender({ shouldRender: () => true })).to.be.true;
        });
      });
    });
  });

  describe('init()', () => {
    it('should call expose()', () => {
      const props = list.props = <any>{ a: 'b' };
      const expose = list.expose = spy();

      list.init();

      expect(expose).to.be.calledWith('list', props);
    });
  });

  describe('isGrid()', () => {
    it('should return false if layout is list', () => {
      expect(list.isGrid()).to.be.false;
    });

    it('should return true if layout is grid', () => {
      list.props = { layout: 'grid' };

      expect(list.isGrid()).to.be.true;
    });

    it('should be case insensitive', () => {
      list.props = { layout: 'GriD' };

      expect(list.isGrid()).to.be.true;
    });
  });
});
