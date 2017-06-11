import { tag, Tag } from '@storefront/core';

@tag('gb-raw', '<span></span>')
class Raw {

  content: string;

  onBeforeMount() {
    this.updateContent();
  }

  onUpdate() {
    if (this.content !== this.props.content) {
      this.updateContent();
    }
  }

  updateContent() {
    this.root.innerHTML = this.content = this.props.content;
  }
}

interface Raw extends Tag<Raw.Props> { }
namespace Raw {
  export interface Props {
    content: string;
  }
}

export default Raw;
