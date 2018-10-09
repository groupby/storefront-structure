import InfiniteList from '../../src/infinite-list';
import List from '../../src/list';
import suite from './_suite';

suite('InfiniteList', ({ expect, spy, itShouldProvideAlias }) => {
  let infiniteList: InfiniteList;

  beforeEach(() => (infiniteList = new InfiniteList()));

  itShouldProvideAlias(InfiniteList, 'list');
  itShouldProvideAlias(InfiniteList, 'infiniteList');

  describe('inheritance', () => {
    it('should extend List', () => {
      expect(infiniteList).to.be.an.instanceOf(List);
    });
  });
});
