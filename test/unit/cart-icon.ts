import { Events } from '@storefront/core';
import CartIcon from '../../src/cart-icon';
import suite from './_suite';

suite('CartIcon', ({ expect, stub, spy }) => {
  let cartIcon: CartIcon;

  beforeEach(() => cartIcon = new CartIcon());

  describe('constructor()', () => {
    beforeEach(() => {

    });
    
    it('should initialize the state', () => {
      const select = CartIcon.prototype.select = stub().returns({ content: { totalQuantity: 2 } });

      expect(cartIcon.state).to.eql({ totalQuantity: 2 });
    });
  });

  describe('init()', () => {
    it('listen to event CART_QUANTITY_UPDATED', () => {
      const on = spy();
      cartIcon.flux = <any>{ on };
      const updateQuantity = spy();
      cartIcon.updateQuantity = updateQuantity;

      cartIcon.init();
      expect(on).to.be.calledWithExactly(Events.CART_QUANTITY_UPDATED, updateQuantity);
    });
  });

  describe('updateQuantity()', () => {
    it('should update quantity', () => {
      const set = cartIcon.set = spy();
      cartIcon.updateQuantity(2);

      expect(set).to.be.calledWithExactly({totalQuantity: 2});
    });
  });
});
