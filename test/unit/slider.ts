import { utils } from '@storefront/core';
import Slider from '../../src/slider';
import suite from './_suite';

suite('Slider', ({ expect, spy, stub }) => {
  let slider: Slider;

  beforeEach(() => slider = new Slider());

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default values', () => {
        expect(slider.props).to.eql({ min: 0, max: 100 });
      });
    });
  });

  describe('onMount()', () => {
    it('should set initial state and move both handles', () => {
      const moveHandle = slider.moveHandle = spy();
      const upper = <any>{ a: 'b' };
      const lower = <any>{ c: 'd' };
      const low = 30;
      const high = 500;
      slider.refs = <any>{ lower, upper };
      slider.props = <any>{ low, high };

      slider.onMount();

      expect(moveHandle).to.be.calledWithExactly(lower, low);
      expect(moveHandle).to.be.calledWithExactly(upper, high);
    });
  });

  describe('moveHandle()', () => {
    it('should call setup(), percentage(), and moveElements()', () => {
      const handle = <any>{ a: 'b' };
      const value = 50;
      const percent = 100;
      const setup = slider.setup = spy();
      const percentage = slider.percentage = spy(() => percent);
      const moveElements = slider.moveElements = spy();
      slider.props = <any>{ min: 20, max: 100 };

      slider.moveHandle(handle, value);

      expect(setup).to.be.calledWithExactly(handle);
      expect(percentage).to.be.calledWithExactly(30, 80);
      expect(moveElements).to.be.calledWithExactly(percent);
    });
  });

  describe('onClick()', () => {
    const mouseLeft = 10;
    let preventDefault;
    let stopPropagation;
    let setup;
    let redraw;

    beforeEach(() => {
      preventDefault = spy();
      stopPropagation = spy();
      setup = slider.setup = spy();
      redraw = slider.redraw = spy();
    });

    it('should call setup() with lower and redraw()', () => {
      const upper = { getBoundingClientRect: () => ({ right: 1000 }) };
      const lower = { getBoundingClientRect: () => ({ left: 100 }) };
      const event = <any>{
        preventDefault,
        stopPropagation,
        clientX: mouseLeft
      };
      slider.refs = <any>{ lower, upper };

      slider.onClick(event);

      expect(preventDefault).to.be.called;
      expect(stopPropagation).to.be.called;
      expect(setup).to.be.calledWithExactly(lower);
      expect(redraw).to.be.calledWithExactly(mouseLeft);
    });

    it('should call setup() with upper and redraw()', () => {
      const upper = { getBoundingClientRect: () => ({ right: 100 }) };
      const lower = { getBoundingClientRect: () => ({ left: 1000 }) };
      const event = <any>{
        preventDefault,
        stopPropagation,
        clientX: mouseLeft
      };
      slider.refs = <any>{ lower, upper };

      slider.onClick(event);

      expect(preventDefault).to.be.called;
      expect(stopPropagation).to.be.called;
      expect(setup).to.be.calledWithExactly(upper);
      expect(redraw).to.be.calledWithExactly(mouseLeft);
    });
  });

  describe('onDragStart()', () => {
    it('should setup state, and add eventListeners to document', () => {
      const preventDefault = spy();
      const stopPropagation = spy();
      const setup = slider.setup = spy();
      const addEventListener = spy();
      const target = { a: 'b' };
      const event = <any>{
        preventDefault,
        stopPropagation,
        target
      };
      stub(utils, 'WINDOW').returns({ document: { addEventListener } });

      slider.onDragStart(event);

      expect(preventDefault).to.be.called;
      expect(stopPropagation).to.be.called;
      expect(setup).to.be.calledWithExactly(target);
      expect(addEventListener).to.be.calledWithExactly('mousemove', slider.onMouseMove);
      expect(addEventListener).to.be.calledWithExactly('touchmove', slider.onTouchMove);
      expect(addEventListener).to.be.calledWithExactly('mouseup', slider.onDragEnd);
      expect(addEventListener).to.be.calledWithExactly('touchend', slider.onDragEnd);
    });
  });

  describe('onMouseMove()', () => {
    it('should call redraw() with mouseLeft', () => {
      const mouseLeft = 50;
      const event = <any>{ clientX: mouseLeft };
      const redraw = slider.redraw = spy();

      slider.onMouseMove(event);

      expect(redraw).to.be.calledWithExactly(mouseLeft);
    });
  });

  describe('onTouchMove()', () => {
    const mouseLeft = 50;
    const handle = { a: 'b' };
    let redraw;

    beforeEach(() => redraw = slider.redraw = spy());

    it('should call redraw() with mouseLeft', () => {
      const event = <any>{
        changedTouches: {
          0: {
            target: handle,
            clientX: mouseLeft
          }
        }
      };
      slider.state = { handle };

      slider.onTouchMove(event);

      expect(redraw).to.be.calledWithExactly(mouseLeft);
    });

    it('should not call redraw() with mouseLeft', () => {
      const event = <any>{
        changedTouches: {
          0: {
            target: { c: 'd' },
            clientX: mouseLeft
          }
        }
      };
      slider.state = { handle };

      slider.onTouchMove(event);

      expect(redraw).not.to.be.called;
    });
  });

  describe('onDragEnd()', () => {
    it('should remove eventListeners from document', () => {
      const preventDefault = spy();
      const stopPropagation = spy();
      const setup = slider.setup = spy();
      const removeEventListener = spy();
      const target = { a: 'b' };
      const event = <any>{
        preventDefault,
        stopPropagation,
        target
      };
      stub(utils, 'WINDOW').returns({ document: { removeEventListener } });

      slider.onDragEnd(event);

      expect(removeEventListener).to.be.calledWithExactly('mousemove', slider.onMouseMove);
      expect(removeEventListener).to.be.calledWithExactly('touchmove', slider.onTouchMove);
      expect(removeEventListener).to.be.calledWithExactly('mouseup', slider.onDragEnd);
      expect(removeEventListener).to.be.calledWithExactly('touchend', slider.onDragEnd);
    });
  });

  describe('setup()', () => {
    const baseLength = 300;
    const baseLeft = 20;
    const base = { getBoundingClientRect: () => ({ width: baseLength, left: baseLeft }) };

    it('should update state, and set limit to upper left percentage', () => {
      const limit = 40;
      const lower = <any>{ style: { left: 20 } };
      const upper = { style: { left: limit } };
      const newState = {
        ...slider.state,
        baseLength,
        baseLeft,
        handle: lower,
        isLower: true,
        limit
      };
      slider.refs = <any>{ lower, upper, base };

      slider.setup(lower);

      expect(slider.state).to.eql(newState);
    });

    it('should update state, and set limit to lower left percentage', () => {
      const limit = 45;
      const lower = { style: { left: limit } };
      const upper = <any>{ style: { left: 30 } };
      const newState = {
        ...slider.state,
        baseLength,
        baseLeft,
        handle: upper,
        isLower: false,
        limit
      };
      slider.refs = <any>{ lower, upper, base };

      slider.setup(upper);

      expect(slider.state).to.eql(newState);
    });
  });

  describe('redraw()', () => {
    it('should update mouseLeft, call calcMouseToPercentage(), moveElements(), and setInput()', () => {
      const mouseLeft = 150;
      const percent = 20;
      const state = slider.state = <any>{ a: 'b' };
      const newState = { ...state, mouseLeft };
      const calcMouseToPercentage = slider.calcMouseToPercentage = spy(() => percent);
      const moveElements = slider.moveElements = spy();
      const setInput = slider.setInput = spy();

      slider.redraw(mouseLeft);

      expect(slider.state).to.eql(newState);
      expect(calcMouseToPercentage).to.be.called;
      expect(moveElements).to.be.calledWithExactly(percent);
      expect(setInput).to.be.calledWithExactly(percent);
    });
  });

  describe('moveElements()', () => {
    const percentage = 20;
    const handle = { style: { left: '40%' } };
    const lower = { style: { 'z-index': 1 } };
    let moveConnect;

    beforeEach(() => moveConnect = slider.moveConnect = spy());

    it('should update handle left, move connect, and set handleLower z-index to 10', () => {
      slider.state = { limit: 20, isLower: true, handle };
      slider.refs = <any>{ lower };

      slider.moveElements(percentage);

      expect(moveConnect).to.be.calledWithExactly(percentage);
      expect(slider.state.handle.style.left).to.eq(percentage + '%');
      expect(slider.refs.lower.style['z-index']).to.eq(10);
    });

    it('should update handle left, move connect, and set handleLower z-index to 1', () => {
      slider.state = { limit: 20, isLower: false, handle };
      slider.refs = <any> { lower };

      slider.moveElements(percentage);

      expect(moveConnect).to.be.calledWithExactly(percentage);
      expect(slider.state.handle.style.left).to.eq(percentage + '%');
      expect(slider.refs.lower.style['z-index']).to.eq(1);
    });
  });

  describe('calcMouseToPercentage()', () => {
    it('should call percentage() with location and baseLength', () => {
      const baseLength = 100;
      const percentage = slider.percentage = spy();
      slider.state = { mouseLeft: 40, baseLeft: 30, baseLength };

      slider.calcMouseToPercentage();

      expect(percentage).to.be.calledWithExactly(10, baseLength);
    });
  });

  describe('percentage()', () => {
    it('should return percentage in between limit and 0', () => {
      const limit = 80;
      slider.state = { limit, isLower: true };

      expect(slider.percentage(15, 30)).to.eq(50);
    });

    it('should return percentage no higher than limit when handle is lower', () => {
      const limit = 20;
      slider.state = { limit, isLower: true };

      expect(slider.percentage(5, 5)).to.eq(limit);
    });

    it('should return percentage no lower than 0 when handle is lower', () => {
      const limit = 20;
      slider.state = { limit, isLower: true };

      expect(slider.percentage(-40, 5)).to.eq(0);
    });

    it('should return percentage in between limit and 100', () => {
      const limit = 30;
      slider.state = { limit, isLower: false };

      expect(slider.percentage(15, 45)).to.eq(33);
    });

    it('should return percentage no lower than limit when handle is upper', () => {
      const limit = 20;
      slider.state = { limit, isLower: false };

      expect(slider.percentage(10, 100)).to.eq(limit);
    });

    it('should return percentage no higher than 100 when handle is upper', () => {
      const limit = 20;
      slider.state = { limit, isLower: false };

      expect(slider.percentage(10, 1)).to.eq(100);
    });
  });

  describe('moveConnect()', () => {
    it('should set connect left when isLower is true', () => {
      const percentage = 20;
      slider.state = { isLower: true };
      slider.refs = <any>{
        connect: {
          style: {
            left: '10%'
          }
        }
      };

      slider.moveConnect(percentage);

      expect(slider.refs.connect.style.left).to.eq(`${percentage}%`);
    });

    it('should set connect right when isLower is false', () => {
      const percentage = 50;
      slider.state = { isLower: false };
      slider.refs = <any>{
        connect: {
          style: {
            right: '10%'
          }
        }
      };

      slider.moveConnect(percentage);

      expect(slider.refs.connect.style.right).to.eq(`${percentage}%`);
    });
  });

  describe('setInput()', () => {
    let onChange;

    beforeEach(() => onChange = spy());

    it('should call onChange() with input and props.high when isLower is true', () => {
      const high = 200;
      slider.props = <any>{
        high,
        onChange,
        max: 100,
        min: 40
      };
      slider.state = <any>{ isLower: true };

      slider.setInput(50);

      expect(onChange).to.be.calledWithExactly(70, 200);
    });

    it('should call onChange() with props.low and input when isLower is false', () => {
      const low = 100;
      slider.props = <any>{
        low,
        onChange,
        max: 100,
        min: 40
      };
      slider.state = <any>{ isLower: false };

      slider.setInput(50);

      expect(onChange).to.be.calledWithExactly(100, 70);
    });
  });
});
