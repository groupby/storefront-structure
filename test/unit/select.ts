import Select from '../../src/select';
import suite from './_suite';

suite('Select', ({ expect, spy }) => {
  let select: Select;

  beforeEach(() => select = new Select());

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(select.props).to.eql({
          options: [],
          optionAlias: 'option',
          indexAlias: 'i'
        });
      });
    });
  });

  describe('init()', () => {
    it('should call expose()', () => {
      const props = select.props = <any>{ a: 'b' };
      const expose = select.expose = spy();

      select.init();

      expect(expose).to.be.calledWith('select', props);
    });
  });
});
