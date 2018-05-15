import SelectOption from '../../src/select-option';
import suite from './_suite';

suite('SelectOption', ({ expect, spy }) => {
  let selectOption: SelectOption;

  beforeEach(() => (selectOption = new SelectOption()));

  describe('onBeforeMount()', () => {
    it('should call updateContent()', () => {
      const updateState = (selectOption.updateState = spy());

      selectOption.onBeforeMount();

      expect(updateState).to.be.called;
    });
  });

  describe('onMount()', () => {
    it('should call updateContent()', () => {
      const updateContent = (selectOption.updateContent = spy());

      selectOption.onMount();

      expect(updateContent).to.be.called;
    });
  });

  describe('onUpdate', () => {
    it('should call updateState()', () => {
      const updateState = (selectOption.updateState = spy());
      selectOption.updateContent = () => null;

      selectOption.onUpdate();

      expect(updateState).to.be.called;
    });

    it('should call updateContent()', () => {
      const updateContent = (selectOption.updateContent = spy());
      selectOption.updateState = () => null;

      selectOption.onUpdate();

      expect(updateContent).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should update aliases', () => {
      const option = (selectOption.option = <any>{ a: 'b' });
      const index = (selectOption.i = 8);
      selectOption.state = { e: 'f' } as any;

      selectOption.updateState();

      expect(selectOption.state).to.eql({ e: 'f', option, index });
    });
  });

  describe('updateContent()', () => {
    it('should override <option> label', () => {
      const label = 'some simple label';
      const textContent = 'some complex label';
      const root = (selectOption.root = <any>{ label, textContent });

      selectOption.updateContent();

      expect(root.label).to.eq(textContent);
    });

    it('should not override <option> label', () => {
      const label = 'some simple label';
      selectOption.root = <any>{
        textContent: label,
        get label() {
          return label;
        },
        set label(value: string) {
          expect.fail();
        },
      };

      selectOption.updateContent();
    });
  });
});
