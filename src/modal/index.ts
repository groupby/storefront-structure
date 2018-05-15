import { provide, tag, utils, Tag } from '@storefront/core';

@provide('modal')
@tag('gb-modal', require('./index.html'), require('./index.css'))
class Modal {
  refs: {
    content: HTMLDivElement;
  };
  props: Modal.Props = {
    autoOpen: false,
  };

  init() {
    this.set({ visible: this.props.autoOpen });
  }

  onUnmount() {
    utils.WINDOW().document.removeEventListener('click', this.close);
  }

  handleOpen = (event: MouseEvent & Tag.Event) => {
    event.preventUpdate = true;
    event.preventDefault();
    event.stopPropagation();

    const { body, addEventListener } = utils.WINDOW().document;
    body.style.overflow = 'hidden';
    addEventListener('click', this.close);
    this.set({ visible: true });
  };

  handleClose = () => {
    const { body, removeEventListener } = utils.WINDOW().document;
    body.style.removeProperty('overflow');
    removeEventListener('click', this.close);
    this.set({ visible: false });
  };

  close = (event: MouseEvent & { target: HTMLElement }) => {
    if (!this.refs.content.contains(event.target)) {
      this.handleClose();
    }
  };
}

interface Modal extends Tag<Modal.Props, Modal.State> {}
namespace Modal {
  export interface Props extends Tag.Props {
    autoOpen: boolean;
  }

  export interface State {
    visible: boolean;
  }
}

export default Modal;
