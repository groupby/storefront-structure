import { view, Component } from '@storefront/core';

@view('gb-raw', '<span></span>')
class Raw extends Component {
  content: string;
  props: Raw.Props;

  onBeforeMount() {
    this.updateContent();
  }

  onUpdate() {
    if (this.content !== this.props.content) {
      this.updateContent();
    }
  }

  updateContent = () => this.root.innerHTML = this.content = this.props.content;
}

namespace Raw {
  export interface Props {
    content: string;
  }
}

export default Raw;
