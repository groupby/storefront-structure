import CustomSelect from '../../src/custom-select';
import suite from './_suite';

suite('CustomSelect', ({ expect, spy }) => {
  let customSelect: CustomSelect;

  beforeEach(() => customSelect = new CustomSelect());

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(customSelect.isActive).to.be.false;
    });

    describe('props', () => {
      it('should set initial value', () => {
        expect(customSelect.props).to.eql({ hover: false });
      });
    });

    describe('state', () => {
      describe('selected()', () => {
        it('should find the selected option', () => {
          const option = { selected: true };
          customSelect.$select = <any>{ options: [{}, {}, option] };

          const selected = customSelect.state.selected();

          expect(selected).to.eq(option);
        });
      });

      describe('onSelect()', () => {
        it('should call $select.onSelect if it exists', () => {
          const onSelect = spy();
          const index = 18;
          customSelect.$select = <any>{ onSelect };
          customSelect.update = () => null;
          customSelect.refs = <any>{ toggle: { blur: () => null } };

          customSelect.state.onSelect(<any>{ item: { i: index } });

          expect(onSelect).to.be.calledWith(index);
        });

        it('should update() isActive to false and blur the toggle', () => {
          const blur = spy();
          const update = customSelect.update = spy();
          customSelect.$select = <any>{};
          customSelect.refs = <any>{ toggle: { blur } };

          customSelect.state.onSelect(<any>{});

          expect(update).to.be.calledWith({ isActive: false });
          expect(blur).to.be.called;
        });
      });
    });
  });

  describe('onHoverActivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.props = <any>{};

      customSelect.onHoverActivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should set isActive if in hover mode', () => {
      const update = customSelect.update = spy();
      customSelect.props = <any>{ hover: true };
      customSelect.isActive = false;

      customSelect.onHoverActivate(<any>{});

      expect(update).to.be.calledWith({ isActive: true });
    });

    it('should not set isActive if not in hover mode', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.isActive = false;

      customSelect.onHoverActivate(<any>{});
    });

    it('should not set isActive if already set', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{ hover: true };
      customSelect.isActive = true;

      customSelect.onHoverActivate(<any>{});
    });
  });

  describe('onClickDeactivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.update = () => null;
      customSelect.props = <any>{};

      customSelect.onClickDeactivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should call update()', () => {
      const update = customSelect.update = spy();
      customSelect.props = <any>{};

      customSelect.onClickDeactivate(<any>{});

      expect(update).to.be.called;
    });

    it('should call update() if configured for hover', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onClickDeactivate(<any>{});
    });

    it('should call update() if active', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.isActive = true;

      customSelect.onClickDeactivate(<any>{});
    });
  });

  describe('onLostFocus', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.props = <any>{};

      customSelect.onLostFocus(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should unset isActive', () => {
      customSelect.props = <any>{};
      customSelect.isActive = true;

      customSelect.onLostFocus(<any>{});

      expect(customSelect.isActive).to.be.false;
    });

    it('should not set isActive if in hover mode', () => {
      customSelect.props = <any>{ hover: true };
      customSelect.isActive = true;

      customSelect.onLostFocus(<any>{});

      expect(customSelect.isActive).to.be.true;
    });
  });

  describe('onClickActivate()', () => {
    it('should toggle isActive on', () => {
      const focus = spy();
      const update = customSelect.update = spy();
      customSelect.isActive = false;
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { focus } };

      customSelect.onClickActivate();

      expect(update).to.be.calledWith({ isActive: true });
      expect(focus).to.be.called;
    });

    it('should toggle isActive off', () => {
      const blur = spy();
      const update = customSelect.update = spy();
      customSelect.isActive = true;
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { blur } };

      customSelect.onClickActivate();

      expect(update).to.be.calledWith({ isActive: false });
      expect(blur).to.be.called;
    });

    it('should only toggle if click mode', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onClickActivate();
    });
  });
});
