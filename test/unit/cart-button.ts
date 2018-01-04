import CartButton from '../../src/cart-button';
import suite from './_suite';
import { TransformUtils } from '@storefront/core';

suite('CartButton', ({ expect, spy }) => {
  let cartButton: CartButton;

  beforeEach(() => cartButton = new CartButton());

  describe.only('productTransformer()', () => {
    it('should transform product', () => {
      cartButton.config = <any>{
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
      }

      const result = cartButton.productTransformer(item, 2);

      expect(result).to.eql(expected);


    });
  });
});
