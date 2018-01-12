import { Selectors } from '@storefront/core';
import QuantitySelector from '../../src/quantity-selector';
import suite from './_suite';

suite('QuantitySelector', ({ expect, stub, spy }) => {
  let quantitySelector: QuantitySelector;

  beforeEach(() => quantitySelector = new QuantitySelector());

  describe('onMount()', () => {
    it('should emit event', () => {
      const emit = spy();
      const flux: any = { emit };
      const state: any = { value: 1 };
      quantitySelector.flux = flux;
      quantitySelector.state = state;

      quantitySelector.onMount();

      expect(emit).to.be.calledWithExactly('quantitySelector:change_quantity', 1);
    });
  });

  describe('quantityHandler()', () => {
    it('should perform onChange handler if there is one', () => {
      const event: any = 'a';
      const onchange = spy();
      quantitySelector.props = <any>{ onchange };

      quantitySelector.quantityHandler(event);

      expect(onchange).to.be.called;
    });

    it('should set state and dispatch action with correct quantity', () => {
      const event: any = { target: { value: '10' } };
      const set = spy();
      const itemQuantityChanged = spy();
      quantitySelector.set = set;
      quantitySelector.actions = <any>{ itemQuantityChanged };
      quantitySelector.props = <any>{ product: 'frog' };

      const result = quantitySelector.quantityHandler(event);

      expect(set).to.be.calledWithExactly({ value: 10 });
      expect(itemQuantityChanged).to.be.calledWithExactly('frog', 10);
    });
  });
});
