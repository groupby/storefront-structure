import SelectOption from '../../src/select-option';
import suite from './_suite';

suite('SelectOption', ({ expect, spy }) => {
  let selectOption: SelectOption;

  beforeEach(() => selectOption = new SelectOption());

  describe('init()', () => {
    it('should expose item and index', () => {
      const optionAlias = 'some option';
      const indexAlias = 'some index';
      const option = selectOption.option = <any>{ a: 'b' };
      const index = selectOption.i = 8;
      const expose = selectOption.expose = spy();
      selectOption.$select = <any>{ optionAlias, indexAlias };

      selectOption.init();

      expect(expose).to.be.calledWith(optionAlias, option).calledWith(indexAlias, index);
    });
  });

  describe('onMount()', () => {
    it('should call updateContent()', () => {
      const updateContent = selectOption.updateContent = spy();

      selectOption.onMount();

      expect(updateContent).to.be.called;
    });
  });

  describe('onUpdate', () => {
    it('should update aliases', () => {
      const option = selectOption.option = <any>{ a: 'b' };
      const index = selectOption.i = 8;
      const optionAlias = selectOption.optionAlias = 'myOption';
      const indexAlias = selectOption.indexAlias = 'myIndex';
      const updateAlias = selectOption.updateAlias = spy();
      selectOption.updateContent = () => null;

      selectOption.onUpdate();

      expect(updateAlias).to.be.calledWith(optionAlias, option).calledWith(indexAlias, index);
    });

    it('should call updateContent()', () => {
      const updateContent = selectOption.updateContent = spy();
      selectOption.updateAlias = () => null;

      selectOption.onUpdate();

      expect(updateContent).to.be.called;
    });
  });

  describe('updateContent()', () => {
    it('should override <option> label', () => {
      const label = 'some simple label';
      const textContent = 'some complex label';
      const root = selectOption.root = <any>{ label, textContent };

      selectOption.updateContent();

      expect(root.label).to.eq(textContent);
    });

    it('should not override <option> label', () => {
      const label = 'some simple label';
      selectOption.root = <any>{
        textContent: label,
        get label() { return label; },
        set label(value: string) { expect.fail(); }
      };

      selectOption.updateContent();
    });
  });
});
