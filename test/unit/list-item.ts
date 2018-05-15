import * as sinon from 'sinon';
import ListItem from '../../src/list-item';
import suite from './_suite';

suite('ListItem', ({ expect, spy }) => {
  let listItem: ListItem;

  beforeEach(() => (listItem = new ListItem()));

  describe('init()', () => {
    it('should provide the item and index as aliases', () => {
      const itemAlias = 'someAlias';
      const indexAlias = 'someIndex';
      const provide = (listItem.provide = spy());
      const item = { a: 'b' };
      const index = 9;
      const state = { item, index };
      listItem.props = { itemAlias, indexAlias };

      listItem.init();

      expect(provide).to.be.calledWith(itemAlias, sinon.match((cb) => expect(cb(null, state)).to.eq(item)));
      expect(provide).to.be.calledWith(indexAlias, sinon.match((cb) => expect(cb(null, state)).to.eq(index)));
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updateState()', () => {
      const updateState = (listItem.updateState = spy());

      listItem.onBeforeMount();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should update item and index aliases', () => {
      const updateState = (listItem.updateState = spy());

      listItem.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should update item and index aliases', () => {
      const item = (listItem.item = { a: 'b' });
      const index = (listItem.i = 7);
      listItem.state = { c: 'd' } as any;

      listItem.onUpdate();

      expect(listItem.state).to.eql({ c: 'd', item, index });
    });
  });
});
