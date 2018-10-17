import FilteredList from '../../src/filtered-list';
import suite from './_suite';

suite('FilteredList', ({ expect, spy }) => {
  let filteredList: FilteredList;

  beforeEach(() => (filteredList = new FilteredList()));

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(filteredList.props).eql(<any>{
          items: [],
        });
      });
    });

    describe('state', () => {
      it('should set initial values', () => {
        expect(filteredList.state.items).to.eql([]);
      });
    });
  });

  describe('childProps()', () => {
    it('should return childProps object', () => {
      const itemAlias = 'itemAlias';
      const indexAlias = 'indexAlias';
      const items = (filteredList.state.items = <any>[1, 2, 3, 4]);

      filteredList.props = { ...filteredList.props, itemAlias, indexAlias };
      expect(filteredList.childProps()).to.eql({ itemAlias, indexAlias, items });
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const items = ['a', 'b'];
      filteredList.props = { items };

      filteredList.onBeforeMount();

      expect(updateItems).to.be.calledWith('');
    });
  });

  describe('onUpdate()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const items = ['a', 'b'];
      filteredList.props = { items };

      filteredList.onUpdate();

      expect(updateItems).to.be.calledWith();
    });
  });

  describe('onFilterChange()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const set = (filteredList.set = spy());

      filteredList.onFilterChange(<any>{});

      expect(updateItems).to.be.calledWith();
      expect(set).to.be.calledWithExactly(true);
    });
  });

  describe('onKeyDown()', () => {
    it('should select refinement', () => {
      const refinements: any = [{ value: 'a' , onClick: spy() }, { value: 'b', onClick: spy() }];
      const keyboardEvent = { keyCode: 13 }
      const input = <any>{ value: 'a' };
      filteredList.props = { items: refinements };
      filteredList.refs = {filter: input}

      filteredList.onKeyDown(keyboardEvent);

      expect(refinements[0].onClick).to.be.called
      expect(refinements[1].onClick).to.be.not.called
    });

    it('should not select refinement', () => {
      const refinements: any = [{ value: 'a' , onClick: spy() }, { value: 'b', onClick: spy() }];
      const keyboardEvent = { keyCode: 15 }
      const input = <any>{ value: 'a' };
      filteredList.props = { items: refinements };
      filteredList.refs = {filter: input}

      filteredList.onKeyDown(keyboardEvent);

      expect(refinements[0].onClick).to.be.not.called
      expect(refinements[1].onClick).to.be.not.called
    });
  });

  describe('onFilterFocus()', () => {
    it('should call props.onFilterFocus()', () => {
      const onFilterFocus = spy();
      const event: any = { a: 'b' };
      filteredList.props = { onFilterFocus };

      filteredList.onFilterFocus(event);

      expect(onFilterFocus).to.be.calledWith(event);
    });

    it('should do nothing if props.onFilterFocus is not a function', () => {
      const onFilterFocus: any = true;
      const event: any = { a: 'b' };
      filteredList.props = { onFilterFocus };

      expect(() => filteredList.onFilterFocus(event)).to.not.throw;
    });
  });

  describe('updateItems()', () => {
    it('should filter items', () => {
      const filterValue = 'e';
      const items = ['abc', 'def', 'ghi', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filteredList.state.items).to.eql(['def', 'eee']);
    });

    it('should filter falsey item', () => {
      const filterValue = 'e';
      const items = [null, 'abc', 'efg'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filteredList.state.items).to.eql(['efg']);
    });

    it('should filter out invalid items', () => {
      const filterValue = 'e';
      const items = <any>[null, { i: 'e' }, { value: 'efg' }, { value: true }];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filteredList.state.items).to.eql([{ value: 'efg' }]);
    });

    it('should trim filter value', () => {
      const filterValue = ' \t e \n   ';
      const items = ['abc', 'def', 'ghi', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filteredList.state.items).to.eql(['def', 'eee']);
    });

    it('should filter case-insensitively', () => {
      const filterValue = 'EF';
      const items = ['abc', 'dEf', 'ghi', 'efe'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filteredList.state.items).to.eql(['dEf', 'efe']);
    });

    it('should use value passed in', () => {
      const filterValue = 'a';
      const items = ['abc', 'def', 'ghi', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems('e');

      expect(filteredList.state.items).to.eql(['def', 'eee']);
    });
  });
});
