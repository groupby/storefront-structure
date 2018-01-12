import { Events } from '@storefront/core';
import CartRow from '../../src/cart-row';
import suite from './_suite';

suite('CartRow', ({ expect, stub, spy }) => {
  let cartRow: CartRow;

  beforeEach(() => cartRow = new CartRow());

  describe('removeItem()', () => {
    it('should dispatch action to remove item', () => {
      const product = 'bird';
      const removeItem = spy();
      cartRow.actions = <any>{
        removeItem
      };

      cartRow.state.removeItem(product);

      expect(removeItem).to.be.calledWithExactly(product);
    });
  });

  describe('init()', () => {
    it('listen to event CART_ITEMS_UPDATED', () => {
      const on = spy();
      cartRow.flux = <any>{ on };
      const update = cartRow.update = spy();

      cartRow.init();
      expect(on).to.be.calledWithExactly(Events.CART_ITEMS_UPDATED, update);
    });
  });

  describe('getCartContent()', () => {
    it('should return cart content', () => {
      cartRow.select = () => ({ content: { items: ['a'] } });

      const result = cartRow.getCartContent();

      expect(result).to.eql(['a']);
    });
  });

  describe('getTotalPrice()', () => {
    it('should set state', () => {
      cartRow.select = () => ({ content: { generatedTotalPrice: 19.9 } });

      const result = cartRow.getTotalPrice();

      expect(result).to.eq('19.90');
    });
  });
});
