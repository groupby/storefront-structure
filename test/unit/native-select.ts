import NativeSelect from '../../src/native-select';
import suite from './_suite';

suite('NativeSelect', ({ expect, spy }) => {
  let nativeSelect: NativeSelect;

  beforeEach(() => (nativeSelect = new NativeSelect()));

  describe('onUpdated()', () => {
    it('should set selectedIndex', () => {
      const selector: any = {};
      nativeSelect.props = <any>{ options: [{}, {}, { selected: true }, {}] };
      nativeSelect.refs = <any>{ selector };

      nativeSelect.onUpdated();

      expect(selector.selectedIndex).to.eq(2);
    });

    it('should not set selectedIndex if selectedIndex did not change', () => {
      nativeSelect.refs = <any>{
        selector: {
          set selectedIndex(param: any) {
            expect.fail();
          },
        },
      };
      nativeSelect.props = <any>{
        options: {
          findIndex() {
            return nativeSelect.refs.selector.selectedIndex;
          },
        },
      };

      nativeSelect.onUpdated();
    });
  });

  describe('updateSelection()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      nativeSelect.props = <any>{};

      nativeSelect.updateSelection(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should call $select.onSelect', () => {
      const onSelect = spy();
      const event: any = { target: { selectedIndex: 7 } };
      nativeSelect.props = <any>{ onSelect };

      nativeSelect.updateSelection(event);

      expect(onSelect).to.be.calledWith(7);
    });
  });
});
