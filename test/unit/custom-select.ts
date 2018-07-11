import { utils } from '@storefront/core';
import CustomSelect from '../../src/custom-select';
import suite from './_suite';

suite('CustomSelect', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let customSelect: CustomSelect;

  beforeEach(() => (customSelect = new CustomSelect()));

  itShouldProvideAlias(CustomSelect, 'customSelect');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(customSelect.props).to.eql({ hover: false });
      });
    });

    describe('state', () => {
      it('should set initial values', () => {
        expect(customSelect.state.isActive).to.be.false;
      });

      describe('selected()', () => {
        it('should find the selected option', () => {
          const option = { selected: true };
          customSelect.props = <any>{ options: [{}, {}, option] };

          const selected = customSelect.state.selected();

          expect(selected).to.eq(option);
        });
      });

      describe('onSelect()', () => {
        it('should call $select.onSelect if it exists', () => {
          const onSelect = spy();
          const index = 18;
          customSelect.props = <any>{ onSelect };
          customSelect.set = () => null;

          customSelect.state.onSelect(<any>{ item: { i: index } });

          expect(onSelect).to.be.calledWith(index);
        });

        it('should set() isActive to false', () => {
          const set = (customSelect.set = spy());
          customSelect.props = <any>{};

          customSelect.state.onSelect(<any>{});

          expect(set).to.be.calledWith({ isActive: false });
        });
      });
    });

    describe('onUpdated()', () => {
      it('should add onclick listener to document when isActive is true', () => {
        const addEventListener = spy();
        customSelect.state = { isActive: true } as any;
        stub(utils, 'WINDOW').returns({ document: { addEventListener } });

        customSelect.onUpdated();

        expect(addEventListener).to.be.calledWith('click', customSelect.onClickDeactivate);
      });

      it('should remove onclick listener on document when isActive is false', () => {
        const removeEventListener = spy();
        customSelect.state = { isActive: false } as any;
        stub(utils, 'WINDOW').returns({ document: { removeEventListener } });

        customSelect.onUpdated();

        expect(removeEventListener).to.be.calledWith('click', customSelect.onClickDeactivate);
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
      const set = (customSelect.set = spy());
      customSelect.props = <any>{ hover: true };
      customSelect.state = { isActive: false } as any;

      customSelect.onHoverActivate(<any>{});

      expect(set).to.be.calledWith({ isActive: true });
    });

    it('should not set isActive if not in hover mode', () => {
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.state = { isActive: false } as any;

      customSelect.onHoverActivate(<any>{});
    });

    it('should not set isActive if already set', () => {
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{ hover: true };
      customSelect.state = { isActive: true } as any;

      customSelect.onHoverActivate(<any>{});
    });
  });

  describe('onHoverDeactivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.set = () => null;
      customSelect.props = <any>{};

      customSelect.onHoverDeactivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should call set()', () => {
      const set = (customSelect.set = spy());
      customSelect.props = <any>{};

      customSelect.onHoverDeactivate(<any>{});

      expect(set).to.be.calledWith(true);
    });

    it('should call set() if configured for hover', () => {
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onHoverDeactivate(<any>{});
    });

    it('should call set() if active', () => {
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.state = { isActive: true } as any;

      customSelect.onHoverDeactivate(<any>{});
    });
  });

  describe('onClickDeactivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.set = () => null;
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it("should unset isActive if event target is not this component's button", () => {
      const removeEventListener = spy();
      const button = { a: 'a' };
      const event: any = { target: button };
      const set = (customSelect.set = spy());
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);

      expect(set).to.be.calledWith({ isActive: false });
    });

    it("should do nothing if event target is this component's button", () => {
      const button = { a: 'a' };
      const event: any = { target: button };
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button } } };

      customSelect.onClickDeactivate(event);
    });

    it('should not set isActive if in hover mode', () => {
      const event: any = { target: { a: 'a' } };
      customSelect.props = <any>{ hover: true };
      customSelect.set = () => expect.fail();
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);
    });
  });

  describe('onClickToggleActive()', () => {
    it('should set preventUpdate', () => {
      customSelect.set = () => null;
      customSelect.props = {} as any;

      customSelect.onClickToggleActive();
    });

    it('should toggle isActive on', () => {
      const set = (customSelect.set = spy());
      customSelect.state = { isActive: false } as any;
      customSelect.props = {} as any;

      customSelect.onClickToggleActive();

      expect(set).to.be.calledWith({ isActive: true });
    });

    it('should toggle isActive off', () => {
      const set = (customSelect.set = spy());
      customSelect.state = { isActive: true } as any;
      customSelect.props = <any>{};

      customSelect.onClickToggleActive();

      expect(set).to.be.calledWith({ isActive: false });
    });

    it('should only toggle if click mode', () => {
      customSelect.set = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onClickToggleActive();
    });
  });
});
