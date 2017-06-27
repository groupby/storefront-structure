import { utils } from '@storefront/core';
import CustomSelect from '../../src/custom-select';
import suite from './_suite';

suite('CustomSelect', ({ expect, spy, stub }) => {
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

          customSelect.state.onSelect(<any>{ item: { i: index } });

          expect(onSelect).to.be.calledWith(index);
        });

        it('should update() isActive to false', () => {
          const update = customSelect.update = spy();
          customSelect.$select = <any>{};

          customSelect.state.onSelect(<any>{});

          expect(update).to.be.calledWith({ isActive: false });
        });
      });
    });

   describe('onUpdated()', () => {
     it('should add onclick listener to document when isActive is true', () => {
      const addEventListener = spy();
      customSelect.isActive = true;
      stub(utils.WINDOW, 'document').returns({ addEventListener });

      customSelect.onUpdated();

      expect(addEventListener).to.be.calledWith('click', customSelect.onClickDeactivate);
     });

     it('should remove onclick listener on document when isActive is false', () => {
      const removeEventListener = spy();
      customSelect.isActive = false;
      stub(utils.WINDOW, 'document').returns({ removeEventListener });

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

  describe('onHoverDeactivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.update = () => null;
      customSelect.props = <any>{};

      customSelect.onHoverDeactivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should call update()', () => {
      const update = customSelect.update = spy();
      customSelect.props = <any>{};

      customSelect.onHoverDeactivate(<any>{});

      expect(update).to.be.called;
    });

    it('should call update() if configured for hover', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onHoverDeactivate(<any>{});
    });

    it('should call update() if active', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.isActive = true;

      customSelect.onHoverDeactivate(<any>{});
    });
  });

  describe('onClickDeactivate()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.update = () => null;
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should unset isActive if event target is not this component\'s button', () => {
      const removeEventListener = spy();
      const button = { a: 'a' };
      const event: any = { target: button };
      const update = customSelect.update = spy();
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);

      expect(update).to.be.calledWith({ isActive: false });
    });

    it('should do nothing if event target is this component\'s button', () => {
      const button = { a: 'a' };
      const event: any = { target: button };
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{};
      customSelect.refs = <any>{ toggle: { refs: { button } } };

      customSelect.onClickDeactivate(event);
    });

    it('should not set isActive if in hover mode', () => {
      const event: any = { target: { a: 'a' } };
      customSelect.props = <any>{ hover: true };
      customSelect.update = () => expect.fail();
      customSelect.refs = <any>{ toggle: { refs: { button: { b: 'b' } } } };

      customSelect.onClickDeactivate(event);
    });
  });

  describe('onClickToggleActive()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      customSelect.update = () => null;
      customSelect.props = <any>{};

      customSelect.onClickToggleActive(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should toggle isActive on', () => {
      const update = customSelect.update = spy();
      customSelect.isActive = false;
      customSelect.props = <any>{};

      customSelect.onClickToggleActive(<any>{});

      expect(update).to.be.calledWith({ isActive: true });
    });

    it('should toggle isActive off', () => {
      const update = customSelect.update = spy();
      customSelect.isActive = true;
      customSelect.props = <any>{};

      customSelect.onClickToggleActive(<any>{});

      expect(update).to.be.calledWith({ isActive: false });
    });

    it('should only toggle if click mode', () => {
      customSelect.update = () => expect.fail();
      customSelect.props = <any>{ hover: true };

      customSelect.onClickToggleActive(<any>{});
    });
  });
});
