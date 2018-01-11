import { Events, TransformUtils } from '@storefront/core';
import CartRow from '../../src/cart-row';
import suite from './_suite';

suite.only('CartRow', ({ expect, stub, spy }) => {
  let cartRow: CartRow;

  beforeEach(() => cartRow = new CartRow());

  describe('init()', () => {
    it('listen to event CART_ITEMS_UPDATED', () => {
      const on = cartRow.flux.on = spy();
      const update = cartRow.update = spy();

      cartRow.init();
      expect(on).to.be.calledWithExactly(Events.CART_ITEMS_UPDATED, update);
    });
  });

  describe('getCartContent()', () => {
    it('should return cart content', () => {
      const select = cartRow.select = spy();

      cartRow.getCartContent();

      expect(select).to.be.called;
    });
  });

  describe('quantityHandler()', () => {
    it('should set state', () => {
      const event: any = {
        target: { value: '2' }
      };
      const set = cartRow.set = spy();

      cartRow.quantityHandler(event);

      expect(set).to.be.calledWithExactly({ quantity: 2 });
    });
  });

  describe('productTransformer()', () => {
    it('should transform product', () => {
      cartRow.config = <any>{
        collection: 'special',
        cart: {
          structure: {
            sku: 'data.id',
            productId: 'data.id',
            title: 'data.title',
            price: 'data.price',
            image: 'data.image',
          }
        }
      };
      const item = <any>{
        data: {
          id: '2333',
          image: 'http://happyshopping.com/2333.tif',
          price: '199.99',
          title: 'cat ear hat'
        }
      };
      const expected = {
        sku: '2333',
        productId: '2333',
        title: 'cat ear hat',
        price: '199.99',
        quantity: 2,
        collection: 'special',
        metadata: [{
          key: 'image',
          value: 'http://happyshopping.com/2333.tif'
        }]
      };

      const result = cartRow.productTransformer(item, 2);

      expect(result).to.eql(expected);


    });
  });
});
