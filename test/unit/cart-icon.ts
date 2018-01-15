import { Events, Selectors } from '@storefront/core';
import CartIcon from '../../src/cart-icon';
import suite from './_suite';

suite('CartIcon', ({ expect, stub, spy }) => {
  let cartIcon: CartIcon;
  let select: sinon.SinonStub;

  beforeEach(() => {
    select = CartIcon.prototype.select = stub();
    select.withArgs(Selectors.cart).returns({ content: { totalQuantity: 1 }});
    cartIcon = new CartIcon();
  });

  afterEach(() => {
    delete CartIcon.prototype.select;
  });

  describe('constructor()', () => {
    it('should initialize the state', () => {
      expect(select).to.be.calledWith(Selectors.cart);
      expect(cartIcon.state.totalQuantity).to.eq(1);
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
