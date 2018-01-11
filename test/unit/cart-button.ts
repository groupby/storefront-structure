import { TransformUtils } from '@storefront/core';
import CartButton from '../../src/cart-button';
import suite from './_suite';

suite('CartButton', ({ expect, stub, spy }) => {
  let cartButton: CartButton;

  beforeEach(() => cartButton = new CartButton());

  describe('onClick()', () => {
    it('should perform click handler from props if there is one', () => {
      const event: any = { preventUpdate: null };
      const onClick = spy();
      const props: any = { onClick };
      cartButton.props = props;

      cartButton.onClick(event);
      expect(event.preventUpdate).to.be.true;
      expect(onClick).to.be.calledWithExactly(event);
    });

    it('should add item if no click handler from props', () => {
      const event: any = { preventUpdate: null };
      cartButton.state = { quantity: 1 };
      cartButton.props = <any>{ product: 'a' };
      const addItem = cartButton.addItem = spy();

      cartButton.onClick(event);
      expect(event.preventUpdate).to.be.true;
      expect(addItem).to.be.calledWithExactly('a', 1);
    });
  });

  describe('addItem()', () => {
    it('should dispatch add to cart action', () => {
      const item: any = 'a';
      const quantity = 1;
      const dispatch = spy();
      const addToCart = spy();
      const flux = {
        store: { dispatch },
        actions: { addToCart }
      };
      const transformed = 't';
      cartButton.flux = <any>flux;
      const transform = stub(cartButton, 'productTransformer').returns(transformed);

      cartButton.addItem(item, quantity);

      expect(transform).to.be.calledWithExactly(item, quantity);
      expect(dispatch).to.be.called;
      expect(addToCart).to.be.calledWithExactly(transformed);
    });
  });

  describe('quantityHandler()', () => {
    it('should set state', () => {
      const event: any = {
        target: { value: '2' }
      };
      const set = cartButton.set = spy();

      cartButton.quantityHandler(event);

      expect(set).to.be.calledWithExactly({quantity: 2});
    });
  });

  describe('productTransformer()', () => {
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
      };

      const result = cartButton.productTransformer(item, 2);

      expect(result).to.eql(expected);


    });
  });
});
