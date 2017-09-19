import { tag, utils, Tag } from '@storefront/core';

export const ZINDEX_LOW = 1;
export const ZINDEX_HIGH = 10;

@tag('gb-slider', require('./index.html'), require('./index.css'))
class Slider {

  refs: {
    base: HTMLDivElement,
    lower: HTMLDivElement,
    upper: HTMLDivElement,
    connect: HTMLDivElement
  };
  props: Slider.Props = <any>{
    min: 0,
    max: 100
  };

  onMount() {
    this.moveHandle(this.refs.lower, this.props.low);
    this.moveHandle(this.refs.upper, this.props.high);
  }

  moveHandle(handle: Element, value: number) {
    this.setup(handle);
    this.moveElements(this.percentage(value - this.props.min, this.props.max - this.props.min));
  }

  onClick = (event: MouseEvent & Slider.Event) => {
    event.preventDefault();
    event.stopPropagation();
    const { lower, upper } = this.refs;
    const lowerLeft = lower.getBoundingClientRect().left;
    const upperRight = upper.getBoundingClientRect().right;
    const mouseLeft = event.clientX;

    if (Math.abs(mouseLeft - lowerLeft) < Math.abs(mouseLeft - upperRight)) {
      this.setup(lower);
    } else {
      this.setup(upper);
    }
    this.redraw(mouseLeft);
  }

  onDragStart = (event: MouseEvent & Slider.Event | TouchEvent & Slider.Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setup(event.target);
    utils.WINDOW().document.addEventListener('mousemove', this.onMouseMove);
    utils.WINDOW().document.addEventListener('touchmove', this.onTouchMove);
    utils.WINDOW().document.addEventListener('mouseup', this.onDragEnd);
    utils.WINDOW().document.addEventListener('touchend', this.onDragEnd);
  }

  onMouseMove = (event: MouseEvent & Slider.Event) => {
    this.redraw(event.clientX);
  }

  onTouchMove = (event: TouchEvent & Slider.Event) => {
    const touchEvent = event.changedTouches[0];
    if (touchEvent.target === this.state.handle) {
      this.redraw(touchEvent.clientX);
    }
  }

  onDragEnd = (event: MouseEvent & Slider.Event) => {
    utils.WINDOW().document.removeEventListener('mousemove', this.onMouseMove);
    utils.WINDOW().document.removeEventListener('touchmove', this.onTouchMove);
    utils.WINDOW().document.removeEventListener('mouseup', this.onDragEnd);
    utils.WINDOW().document.removeEventListener('touchend', this.onDragEnd);
  }

  setup = (handle: Element) => {
    const baseDimensions = this.refs.base.getBoundingClientRect();
    const { lower, upper } = this.refs;
    const isLower = lower === handle;
    const limit = parseFloat((isLower ? upper : lower).style.left);
    this.state = {
      ...this.state,
      baseLength: baseDimensions.width,
      baseLeft: baseDimensions.left,
      handle,
      isLower,
      limit
    };
  }

  redraw(mouseLeft: number) {
    this.state = { ...this.state, mouseLeft };
    const percentage = this.calcMouseToPercentage();
    this.moveElements(percentage);
    this.setInput(percentage);
  }

  moveElements(percentage: number) {
    const overlap = percentage === this.state.limit;
    this.state.handle.style.left = `${percentage}%`;
    this.moveConnect(percentage);
    this.refs.lower.style['z-index'] = overlap && this.state.isLower ? ZINDEX_HIGH : ZINDEX_LOW;
  }

  calcMouseToPercentage() {
    return this.percentage(this.state.mouseLeft - this.state.baseLeft, this.state.baseLength);
  }

  percentage(value: number, total: number) {
    const percentage = value / total * 100;
    if (this.state.isLower) {
      return Math.floor(Math.max(Math.min(percentage, this.state.limit), 0));
    } else {
      return Math.floor(Math.max(Math.min(percentage, 100), this.state.limit));
    }
  }

  moveConnect(percentage: number) {
    if (this.state.isLower) {
      this.refs.connect.style.left = `${percentage}%`;
    } else {
      this.refs.connect.style.right = `${100 - percentage}%`;
    }
  }

  setInput(percentage: number) {
    const input = Math.floor((((this.props.max - this.props.min) * percentage) / 100) + this.props.min);
    if (this.state.isLower) {
      this.props.onChange(input, this.props.high);
    } else {
      this.props.onChange(this.props.low, input);
    }
  }

}

interface Slider extends Tag<Slider.Props> { }
namespace Slider {
  export interface Props extends Tag.Props {
    min: number;
    max: number;
    low: number;
    high: number;
    onChange: (low: number, high: number) => void;
  }

  export interface State {
    baseLength?: number;
    baseLeft?: number;
    mouseLeft?: number;
    handle?: Element;
    handleLower?: Element;
    handleUpper?: Element;
    isLower?: boolean;
    connect?: Element;
    limit?: number;
  }

  export type Event = Tag.Event & { target: Element };
}

export default Slider;
