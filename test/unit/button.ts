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
      const event = <any>{};
      button.props = <any>{ onClick };

      button.onClick(event);

      expect(onClick).to.be.calledWith(event);
    });

    it('should not fail if onClick not provided', () => {
      const event = <any>{};
      button.props = <any>{};

      expect(() => button.onClick(event)).to.not.throw();
    });
  });
});
