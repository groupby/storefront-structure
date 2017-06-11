import Button from '../../src/button';
import suite from './_suite';

suite('Button', ({ expect, spy }) => {
  let button: Button;

  beforeEach(() => button = new Button());

  describe('onClick()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      button.props = <any>{};

      button.onClick(event);

      expect(event.preventUpdate).to.eq(true);
    });

    it('should call props.onClick if exists', () => {
      const onClick = spy();
      button.props = <any>{ onClick };

      button.onClick(<any>{});

      expect(onClick).to.be.called;
    });
  });
});
