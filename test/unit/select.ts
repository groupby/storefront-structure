import Select from '../../src/select';
import suite from './_suite';

suite('Select', ({ expect, spy, itShouldProvideAlias }) => {
  let select: Select;

  beforeEach(() => (select = new Select()));

  itShouldProvideAlias(Select, 'select');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(select.props).to.eql({
          options: [],
        });
      });
    });
  });

  describe('childProps()', () => {
    it('should return props', () => {
      const props = (select.props = { a: 'b' } as any);

      expect(select.childProps()).to.eq(props);
    });
  });
});
