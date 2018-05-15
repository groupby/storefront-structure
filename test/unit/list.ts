import List from '../../src/list';
import suite from './_suite';

suite('List', ({ expect, spy, itShouldProvideAlias }) => {
  let list: List;

  beforeEach(() => (list = new List()));

  itShouldProvideAlias(List, 'list');

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

  describe('childProps()', () => {
    it('should return filtered props', () => {
      const itemAlias = 'myItem';
      const indexAlias = 'myIndex';
      list.props = { a: 'b', itemAlias, indexAlias } as any;

      expect(list.childProps()).to.eql({ itemAlias, indexAlias });
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
