import Pill from '../../src/pill';
import suite from './_suite';

suite('pill', ({ expect, spy }) => {
  let pill: Pill;

  beforeEach(() => pill = new Pill());

  describe('onClick()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      pill.props = <any>{};

      pill.onClick(event);

      expect(event.preventUpdate).to.eq(true);
    });

    it('should call props.onClick if exists', () => {
      const onClick = spy();
      const event = <any>{};
      pill.props = <any>{ onClick, selected: false };

      pill.onClick(event);

      expect(onClick).to.be.calledWithExactly(event);
    });
    it('should not fail if onClick not provided', () => {
      const event = <any>{};
      pill.props = <any>{};

      expect(() => pill.onClick(event)).to.not.throw();
    });
  });

  describe('onClose()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      pill.props = <any>{};

      pill.onClose(event);

      expect(event.preventUpdate).to.eq(true);
    });

    it('should call props.onClose if exists', () => {
      const onClose = spy();
      const event = <any>{};
      pill.props = <any>{ onClose, selected: false };

      pill.onClose(event);

      expect(onClose).to.be.calledWithExactly(event);
    });

    it('should not fail if onClose not provided', () => {
      const event = <any>{};
      pill.props = <any>{};

      expect(() => pill.onClose(event)).to.not.throw();
    });
  });
});
