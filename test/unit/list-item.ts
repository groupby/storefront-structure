import ListItem from '../../src/list-item';
import suite from './_suite';

suite('ListItem', ({ expect, spy }) => {
  let listItem: ListItem;

  beforeEach(() => listItem = new ListItem());

  describe('init()', () => {
    it('should expose the item and index', () => {
      const itemAlias = 'someAlias';
      const indexAlias = 'someIndex';
      const expose = listItem.expose = spy();
      const item = listItem.item = { a: 'b' };
      const index = listItem.i = <any>{ c: 'd' };
      listItem.$list = { itemAlias, indexAlias };
      listItem.unexpose = () => null;

      listItem.init();

      expect(expose).to.be.calledWith(itemAlias, item);
      expect(expose).to.be.calledWith(indexAlias, index);
    });

    it('should call unexpose()', () => {
      const unexpose = listItem.unexpose = spy();
      listItem.expose = () => null;
      listItem.$list = {};

      listItem.init();

      expect(unexpose).to.be.calledWith('list');
    });
  });

  describe('onUpdate()', () => {
    it('should update item and index aliases', () => {
      const item = listItem.item = { a: 'b' };
      const index = listItem.i = 7;
      const itemAlias = listItem.itemAlias = 'myItem';
      const indexAlias = listItem.indexAlias = 'myIndex';
      const updateAlias = listItem.updateAlias = spy();

      listItem.onUpdate();

      expect(updateAlias).to.be.calledWith(itemAlias, item);
      expect(updateAlias).to.be.calledWith(indexAlias, index);
    });
  });
});
