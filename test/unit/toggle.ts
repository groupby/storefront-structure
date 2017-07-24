import { utils } from '@storefront/core';
import Toggle from '../../src/toggle';
import suite from './_suite';

suite('Toggle', ({ expect, spy, stub }) => {
  let toggle: Toggle;

  beforeEach(() => toggle = new Toggle());

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default value', () => {
        expect(toggle.props).to.eql({ checked: false });
      });
    });
  });

  describe('onMount()', () => {
    it('should set default checked value on input', () => {
      const input = <any>{ checked: false };
      stub(utils, 'WINDOW').returns({ addEventListener: () => null });
      toggle.refs = <any>{ input };
      toggle.props = { checked: true };

      toggle.onMount();

      expect(input.checked).to.be.true;
    });
  });

  describe('onClick()', () => {
    it('should update onToggle handler with new checked value', () => {
      const onToggle = spy();
      toggle.props = { onToggle };
      toggle.refs = <any>{ input: { checked: true } };

      toggle.onClick(<any>{});

      expect(onToggle).to.be.calledWith(true);
    });

    it('should check for onToggle handler', () => {
      toggle.props = {};

      expect(() => toggle.onClick(<any>{})).to.not.throw();
    });

    it('should prevent update', () => {
      const event: any = {};
      toggle.props = {};

      toggle.onClick(event);

      expect(event.preventUpdate).to.be.true;
    });
  });
});
