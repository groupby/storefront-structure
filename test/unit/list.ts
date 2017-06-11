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
});
