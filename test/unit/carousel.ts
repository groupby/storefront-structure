import { utils } from '@storefront/core';
import Carousel from '../../src/carousel';
import suite from './_suite';

suite('Carousel', ({ expect, spy, stub}) => {
  let carousel: Carousel;

  describe('onMount()', () => {

    it('should update slide width', () => {
      carousel.onMount();

      expect(carousel.populateProps).to.be.called;
    });
  });
});