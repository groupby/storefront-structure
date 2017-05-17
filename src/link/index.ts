import { view, Component } from '@storefront/core';

@view('gb-link', require('./index.html'))
class Link extends Component {
  props: Link.Props;

  onClick = (event: MouseEvent & { preventUpdate?: boolean }) => {
    event.preventUpdate = true;
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}

namespace Link {
  export interface Props {
    onClick(): void;
  }
}

export default Link;
