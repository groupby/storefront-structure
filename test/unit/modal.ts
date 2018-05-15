import { utils } from '@storefront/core';
import Modal from '../../src/modal';
import suite from './_suite';

suite('Modal', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let modal: Modal;

  beforeEach(() => (modal = new Modal()));

  itShouldProvideAlias(Modal, 'modal');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default value', () => {
        expect(modal.props).to.eql({ autoOpen: false });
      });
    });
  });

  describe('init()', () => {
    it('should set visible state to autoOpen', () => {
      const set = (modal.set = spy());

      modal.init();

      expect(set).to.be.calledWithExactly({ visible: modal.props.autoOpen });
    });
  });

  describe('handleOpen()', () => {
    it('should set visible to true, add overflow: hidden style to body and add eventlistener', () => {
      const preventDefault = spy();
      const stopPropagation = spy();
      const event: any = { preventDefault, stopPropagation };
      const addEventListener = spy();
      const style = { overflow: 'auto' };
      const set = (modal.set = spy());
      stub(utils, 'WINDOW').returns({
        document: {
          addEventListener,
          body: { style },
        },
      });

      modal.handleOpen(event);

      expect(preventDefault).to.be.calledOnce;
      expect(stopPropagation).to.be.calledOnce;
      expect(set).to.be.calledWithExactly({ visible: true });
      expect(style).to.eql({ overflow: 'hidden' });
      expect(addEventListener).to.be.calledWithExactly('click', modal.close);
    });
  });

  describe('handleClose()', () => {
    it('should set visible to false, remove overflow from body, and remove click', () => {
      const set = (modal.set = spy());
      const removeEventListener = spy();
      const removeProperty = spy();
      stub(utils, 'WINDOW').returns({
        document: {
          removeEventListener,
          body: { style: { removeProperty } },
        },
      });

      modal.handleClose();

      expect(set).to.be.calledWithExactly({ visible: false });
      expect(removeProperty).to.be.calledWithExactly('overflow');
      expect(removeEventListener).to.be.calledWithExactly('click', modal.close);
    });
  });

  describe('close()', () => {
    it('should call handleClose() if ref content is not being clicked on', () => {
      const target = { a: 'b' };
      const event: any = { target };
      const contains = spy(() => false);
      const handleClose = (modal.handleClose = spy());
      modal.refs = <any>{ content: { contains } };

      modal.close(event);

      expect(contains).to.be.calledWithExactly(target);
      expect(handleClose).to.be.called;
    });

    it('should not call handleClose() if ref content is being clicked on', () => {
      const target = { a: 'b' };
      const event: any = { target };
      const contains = spy(() => true);
      const handleClose = (modal.handleClose = spy());
      modal.refs = <any>{ content: { contains } };

      modal.close(event);

      expect(contains).to.be.calledWithExactly(target);
      expect(handleClose).to.not.be.called;
    });
  });
});
