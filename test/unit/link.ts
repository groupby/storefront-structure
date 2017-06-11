import Link from '../../src/link';
import suite from './_suite';

suite('Link', ({ expect, spy }) => {
  let link: Link;

  beforeEach(() => link = new Link());

  describe('onClick()', () => {
    it('should set preventUpdate and call preventDefault()', () => {
      const preventDefault = spy();
      const event: any = { preventDefault };
      link.props = <any>{};

      link.onClick(event);

      expect(event.preventUpdate).to.be.true;
      expect(preventDefault).to.be.called;
    });

    it('should call props.onClick', () => {
      const onClick = spy();
      link.props = <any>{ onClick };

      link.onClick(<any>{ preventDefault: () => null });

      expect(onClick).to.be.called;
    });
  });
});
